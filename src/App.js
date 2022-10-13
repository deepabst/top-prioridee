import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, } from '@react-three/fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as THREE from "three";
import myFont from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { extend } from '@react-three/fiber';
import { Audio, AudioListener } from 'three';

extend({ TextGeometry })

const seedData = {
  tasks: [
    {
      id: 1,
      summary: 'learn React Hooks',
      // importance: 1,
      // urgency: 5,
      active: false,
    },
    {
      id: 2,
      summary: 'walk the dog',
      // importance: 8,
      // urgency: 1,
      active: false,
    },
    {
      id: 3,
      summary: 'feed the bird',
      // importance: 7,
      // urgency: 2,
      active: false,
    },
    {
      id: 4,
      summary: 'learn CSS',
      // importance: 3,
      // urgency: 7,
      active: false,
    },
  ],
  importance: [1, 4, 3, 2],
  urgency: [2, 3, 1, 4]
}

// sorting algorithm


function Text(props) {
  const font = new FontLoader().parse(myFont);
  return (
    <mesh position={props.position}>
      <textGeometry args={[props.label, { font, size: 0.8, height: 0.5 }]} />
      <meshLambertMaterial attach='material' color={'gold'} />
    </mesh>
  )
}

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = 20;
      controls.maxDistance = 40;
      controls.minPolarAngle = 1;
      controls.maxPolarAngle = 2;
      controls.minAzimuthAngle = -0.5;
      controls.maxAzimuthAngle = 0.5;

      // controls.maxPolarAngle = Math.PI/2; 
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};


function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} transparent />
    </mesh>
  )
}

function QuadrantBox(props) {
  const ref = useRef()
  return (
    <mesh
      {...props}
      ref={ref}
      onClick={() => {
        console.log("Pointer over", props.label);
      }}
    >
      <Text position={[-props.label.length / 3, 0, 0]} label={props.label} />
      <boxGeometry args={[10, 10, 1]} />
      <meshLambertMaterial opacity={0.2} color={props.color} transparent />
    </mesh>
  );
}

function Task({ details }) {
  const [active, setActive] = useState(details.active)

  return (
    <mesh
      position={[details.urgency, details.importance, 0]}
      scale={active ? 1.5 : 1}
      onPointerOver={(event) => {
        setActive(!active);
      }}
      onPointerOut={(event) => {
        setActive(!active);
      }}
      rotation={[Math.PI / 2, 0, 0]}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="gold" />
    </mesh>
  );
}

function Dialog() {
  return (
    <div className='info'>
      <h3>Task Summary</h3>
      Walk the fish
    </div>
  );
}

function AddTaskButton(props) {
  return (
    <button className='add' onClick={props.clickMethod}>
      Add Task
    </button>
  );
}

function AddTaskDialog(props) {
  return (
    <div className='add-task-dialog'>
      <h2>Add new task</h2>
      <div className='add-task-canvas'>
        <Canvas>
          <ambientLight intensity={1.5} />
          <spotLight intensity={3} position={[40, 40, 40]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Task details={{ urgency: 0, importance: 0, active: false }} />
        </Canvas>
      </div>
      <div>
        <AddTaskForm addTask={props.addTask} deactivateAllTasks={props.deactivateAllTasks} />
      </div>
    </div>
  );
}

function AddTaskForm(props) {

  const [task, setTask] = useState({});

  function handleSubmit(e) {
    console.log('Form submitted');
    e.preventDefault();
    props.addTask(task);
  }

  function handleInput(e) {
    // console.log('Input', e.target.value);
    setTask({
      ...task, // copy the existing state 
      [e.target.name]: e.target.value // add the new stuff
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>What needs to be done?</label>
          <input name="summary" type="text" onChange={handleInput} />
        </div>
        <button>Add Task</button>
      </form>
    </div>
  );

}

export default function App() {
  const [tasks, setTasks] = useState(seedData.tasks);
  const [addDialogVisible, setAddDialogVisibility] = useState(false);
  const [importanceArray, setImportanceArray] = useState(seedData.importance);
  const [urgencyArray, setUrgencyArray] = useState(seedData.urgency);
  const [importanceArrayInProgress, setImportanceArrayInProgress] = useState([]);
  const [urgencyArrayInProgress, setUrgencyArrayInProgress] = useState([]);
  const [importanceIndexOffset, setImportanceIndexOffset] = useState(0);
  const [urgencyIndexOffset, setUrgencyIndexOffset] = useState(0);
  const [currentComparisonTask, setCurrentComparisonTask] = useState({});

  function addTask(newTask) {
    newTask.id = Date.now();
    setTasks([...tasks, newTask]);
    setAddDialogVisibility(false);
    // run sorting hat function for importance
    if (tasks.length > 0) {
      // get the middle index of the importanceArray
      const comparisonIndex = selectMiddleIndex(importanceArray); 
      // find the task id at the middle index
      let initialTaskId = importanceArray[comparisonIndex];
      // grab the middle task out of app state
      const initialTask = tasks.find(t => t.id === initialTaskId);
      // put the middle importance task into app state (so we can ask the user to compare it to the new task)
      setCurrentComparisonTask(initialTask);
      //copy the current list of tasks sorted by importance to the temp sorting array
      setImportanceArrayInProgress(importanceArray);
      
      // ***** Repeat questioning for urgency ****
      
      // use the same "middle index" as importance arrays are the same length
      initialTaskId = urgencyArray[comparisonIndex];
      
    }
  }

  function handleComparisonAnswer(answer) {
    console.log({ answer });
    sortStuff(importanceArrayInProgress, answer);
  }

  function selectMiddleIndex(arr) {
    const halvedIndex = Math.floor(arr.length / 2);
    return halvedIndex;
  }

  function sortStuff(arr, isMoreImportant) {
    console.log("--------------");
    const halvedIndex = selectMiddleIndex(arr);
    const comparison = arr[halvedIndex];
    console.log(`The new task more important than: '${comparison}' ?`);
    let newArray;
    // is this task more important than the comparison task
    if (isMoreImportant) {
      newArray = arr.slice(halvedIndex + 1);
      console.log({ arr, newArray });
      setImportanceArrayInProgress(newArray);
      if (newArray.length === 0) {
        console.log('more important base case reached')
        const newItemIndex = importanceIndexOffset + halvedIndex + 1;
        // update importance array to insert at the right place
        const newestTaskId = tasks[tasks.length - 1].id;
        const newImportanceArray = [...importanceArray];
        newImportanceArray.splice(newItemIndex, 0, newestTaskId);
        setImportanceArray(newImportanceArray);
        // console.log({ newItemIndex });

      }
      setImportanceIndexOffset(importanceIndexOffset + halvedIndex + 1);
    } else {
      newArray = arr.slice(0, halvedIndex);
      setImportanceArrayInProgress(newArray);
      if (newArray.length === 0) {
        console.log('less important base case reached')
        const newItemIndex = importanceIndexOffset + halvedIndex;
        console.log({ newItemIndex });
        // update importance array to insert at the right place
        const newestTaskId = tasks[tasks.length - 1].id;
        const newImportanceArray = [...importanceArray];
        newImportanceArray.splice(newItemIndex, 0, newestTaskId);
        setImportanceArray(newImportanceArray);
      }
      // setImportanceIndexOffset( importanceIndexOffset + 0;)
    }

    const nextComparison = selectMiddleIndex(newArray);
    const nextTaskId = newArray[nextComparison];
    const nextTask = tasks.find(t => t.id === nextTaskId);
    setCurrentComparisonTask(nextTask);
    console.log({ newArray, nextComparison, nextTaskId, nextTask });

    //TODO: check if base case reached (i.e nothing left to compare to)
  }

  return (
    <div>
      <Canvas>
        <CameraController />
        <ambientLight intensity={1} />
        <spotLight intensity={3} position={[40, 40, 40]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <QuadrantBox position={[10, 10, 0]} color={'red'} label={'DO'} />
        <QuadrantBox position={[10, 0, 0]} color={'green'} label={'DELEGATE'} />
        <QuadrantBox position={[0, 0, 0]} color={'lightblue'} label={'DELETE'} />
        <QuadrantBox position={[0, 10, 0]} color={'orange'} label={'DEFER'} />
        {
          tasks.map((t) => <Task key={t.id} details={t} />)
        }

      </Canvas>
      <Dialog />
      {
        importanceArrayInProgress.length > 0
        &&
        <div className="comparison">
          <h2>"{tasks[tasks.length - 1].summary}"</h2>
          <h3>is more important than</h3>
          <h2>"{currentComparisonTask.summary}"</h2>
          <button onClick={() => handleComparisonAnswer(true)}>True</button>
          <button onClick={() => handleComparisonAnswer(false)}>False</button>
        </div>
      }
      <AddTaskButton clickMethod={(event) => { setAddDialogVisibility(!addDialogVisible) }} />
      {addDialogVisible &&
        <AddTaskDialog addTask={addTask} />
      }
    </div>
  )
}