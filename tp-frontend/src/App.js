import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, } from '@react-three/fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as THREE from "three";
import myFont from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { extend } from '@react-three/fiber';

extend({ TextGeometry })

const seedData = {
  tasks: [
    {
      id: 1,
      summary: 'learn React Hooks',
      importance: 1,
      urgency: 5,
    },
    {
      id: 2,
      summary: 'walk the dog',
      importance: 8,
      urgency: 1,
    },
    {
      id: 3,
      summary: 'feed the bird',
      importance: 7,
      urgency: 2,
    },
    {
      id: 4,
      summary: 'learn CSS',
      importance: 3,
      urgency: 7,
    },
  ]
}

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
      <Text position={[0, 0, 0]} label={props.label} />
      <boxGeometry args={[10, 10, 1]} />
      <meshLambertMaterial opacity={0.2} color={props.color} transparent />
    </mesh>
  );
}

function Task(props) {
  const [active, setActive] = useState(false)
  return (
    <mesh
      {...props}
      scale={active ? 1.5 : 1}
      onClick={(event) => {
        setActive(!active)
      }}
      rotation={[Math.PI / 2, 0, 0]}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="red" />
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

export default function App() {
  const [tasks, setTasks] = useState(seedData);
  const [selectedTask, setSelectedTask] = useState(null);

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

        {/* <Task position={[1, 4, 0]} setSelectedTask={setSelectedTask} />
        <Task position={[2, 2, 0]} />
        <Task position={[-2, -1, 0]} />
        <Task position={[-3, 3, 0]} />
        <Task position={[4, -4, 0]} /> */}
        {
          tasks.tasks.map((t) => <Task key={t.id} position={[t.urgency,t.importance, 0]} />)
        }

      </Canvas>
      <Dialog />
    </div>
  )
}
