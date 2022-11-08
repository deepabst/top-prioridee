import { useState, useEffect } from 'react'
import { Canvas, useThree, } from '@react-three/fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TaskList from './components/TaskList';
import Task from './components/Task';
import QuadrantBox from './components/QuadrantBox'

const seedData = {
  tasks: [
    {
      id: 1,
      summary: 'learn React Hooks',
      importance: 0,
      urgency: 2,
      active: false,
    },
    {
      id: 2,
      summary: 'walk the dog',
      importance: 3,
      urgency: 0,
      active: false,
    },
    {
      id: 3,
      summary: 'feed the bird',
      importance: 2,
      urgency: 1,
      active: false,
    },
    {
      id: 4,
      summary: 'learn CSS',
      importance: 1,
      urgency: 3,
      active: false,
    },
  ],
  importance: [1, 4, 3, 2],
  urgency: [2, 3, 1, 4]
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

  const [tasks, setTasks] = useState([]);
  const [addDialogVisible, setAddDialogVisibility] = useState(false);
  const [importanceArray, setImportanceArray] = useState(seedData.importance);
  const [urgencyArray, setUrgencyArray] = useState(seedData.urgency);
  const [importanceArrayInProgress, setImportanceArrayInProgress] = useState([]);
  const [urgencyArrayInProgress, setUrgencyArrayInProgress] = useState([]);
  const [importanceIndexOffset, setImportanceIndexOffset] = useState(0);
  const [urgencyIndexOffset, setUrgencyIndexOffset] = useState(0);
  const [currentComparisonTask, setCurrentComparisonTask] = useState({});

  function getPosition(task) {
    const xPos = urgencyArray.findIndex(t => t === task.id);
    const yPos = importanceArray.findIndex(t => t === task.id);
    console.log({ task, yPos, xPos });
    return [xPos, yPos];
  }

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
    }
  }

  function handleComparisonAnswer(answer) {
    console.log({ answer });
    sortStuff(importanceArrayInProgress, answer);
  }
  function handleUrgencyComparisonAnswer(answer) {
    console.log({ answer });
    sortUrgency(urgencyArrayInProgress, answer);
  }

  function selectMiddleIndex(arr) {
    const halvedIndex = Math.floor(arr.length / 2);
    return halvedIndex;
  }

  function initiateUrgencySort() {
    console.log("Hello time to talk about urgency");
    const comparisonIndex = selectMiddleIndex(urgencyArray);
    // find the task id at the middle index
    let initialTaskId = urgencyArray[comparisonIndex];
    // grab the middle task out of app state
    const initialTask = tasks.find(t => t.id === initialTaskId);
    console.log({ comparisonIndex, initialTaskId, initialTask });
    // put the middle importance task into app state (so we can ask the user to compare it to the new task)
    setCurrentComparisonTask(initialTask);
    //copy the current list of tasks sorted by importance to the temp sorting array
    setUrgencyArrayInProgress(urgencyArray);
  }

  function mapPriorityArraysToTasks() {
    console.log("In the map function");
    const newTasks = [...tasks];
    newTasks.forEach(t => {
      const [x, y] = getPosition(t);
      t.urgency = x;
      t.importance = y;
    });
    setTasks(newTasks);
    console.log({ newTasks });
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
        // update importance array to insert new task at the right place
        const newestTaskId = tasks[tasks.length - 1].id;
        const newImportanceArray = [...importanceArray];
        newImportanceArray.splice(newItemIndex, 0, newestTaskId);
        setImportanceArray(newImportanceArray);
        // console.log({ newItemIndex });

        // // TODO: when the arrayinprogress has reached empty again - it's time to ask the urgency questions
        initiateUrgencySort();
        return;
      }
      setImportanceIndexOffset(importanceIndexOffset + halvedIndex + 1);
    } else {
      newArray = arr.slice(0, halvedIndex);
      setImportanceArrayInProgress(newArray);
      if (newArray.length === 0) {
        console.log('less important base case reached')
        const newItemIndex = importanceIndexOffset + halvedIndex;
        console.log({ newItemIndex });
        // update importance array to insert new task at the right place
        const newestTaskId = tasks[tasks.length - 1].id;
        const newImportanceArray = [...importanceArray];
        newImportanceArray.splice(newItemIndex, 0, newestTaskId);
        setImportanceArray(newImportanceArray);
        initiateUrgencySort();
        return;
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

  function sortUrgency(arr, isMoreUrgent) {
    console.log("--------------");
    const halvedIndex = selectMiddleIndex(arr);
    const comparison = arr[halvedIndex];
    // console.log(`The new task more important than: '${comparison}' ?`);
    let newArray;
    // is this task more important than the comparison task
    if (isMoreUrgent) {
      newArray = arr.slice(halvedIndex + 1);
      console.log({ arr, newArray });
      setUrgencyArrayInProgress(newArray);
      if (newArray.length === 0) {
        console.log('more important base case reached')
        const newItemIndex = urgencyIndexOffset + halvedIndex + 1;
        // update importance array to insert new task at the right place
        const newestTaskId = tasks[tasks.length - 1].id;
        const newUrgencyArray = [...urgencyArray];
        newUrgencyArray.splice(newItemIndex, 0, newestTaskId);
        setUrgencyArray(newUrgencyArray);
        // console.log({ newItemIndex });
        console.log("Process Finished!");
        mapPriorityArraysToTasks();

      }
      setUrgencyIndexOffset(urgencyIndexOffset + halvedIndex + 1);
    } else {
      newArray = arr.slice(0, halvedIndex);
      setUrgencyArrayInProgress(newArray);
      if (newArray.length === 0) {
        console.log('less important base case reached')
        const newItemIndex = urgencyIndexOffset + halvedIndex;
        console.log({ newItemIndex });
        // update importance array to insert new task at the right place
        const newestTaskId = tasks[tasks.length - 1].id;
        const newUrgencyArray = [...urgencyArray];
        newUrgencyArray.splice(newItemIndex, 0, newestTaskId);
        setUrgencyArray(newUrgencyArray);
        console.log("Process Finished!");
        mapPriorityArraysToTasks();
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
        <Task details={{ id: 666, summary: 'foo', urgency: 5, importance: 5, active: false }} />
        {
          console.log({ tasks })
        }
        {/* {
          tasks.map((t) => <Task key={t.id} details={t} />)
        } */}

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
      {
        (urgencyArrayInProgress.length > 0 && !(importanceArrayInProgress.length > 0))
        &&
        <div className='ucomparison'>
          <h2>"{tasks[tasks.length - 1].summary}"</h2>
          <h3>is more urgent than</h3>
          <h2>"{currentComparisonTask.summary}"</h2>
          <button onClick={() => handleUrgencyComparisonAnswer(true)}>True</button>
          <button onClick={() => handleUrgencyComparisonAnswer(false)}>False</button>
        </div>
      }
      <AddTaskButton clickMethod={(event) => { setAddDialogVisibility(!addDialogVisible) }} />
      {addDialogVisible &&
        <AddTaskDialog addTask={addTask} />
      }
      <TaskList />
    </div>
  )
}