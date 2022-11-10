import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

function Task(props) {
  console.log("Task created");
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  console.log(`mesh is:`,mesh)
  console.log(`props is:`,props);
  // Set up state for the hovered and active state
  // const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      position={[props.props.urgency, props.props.importance, 0]}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      // onPointerOver={(event) => setHover(true)}
      // onPointerOut={(event) => setHover(false)}
      rotation={[Math.PI / 2, 0, 0]}>
      <sphereGeometry args={[0.8, 32, 32]} />    <meshStandardMaterial color={ active ? "gold" : "white" } />
    </mesh>
  )
}

export default Task;