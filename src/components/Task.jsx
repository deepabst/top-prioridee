import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useEffect } from 'react';

export default function Task(props) {
  console.log("Task rendered");
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (mesh.current.rotation.x += 0.01))

  useEffect(() => {
    const root = document.getElementById('root')
    root.classList.toggle("finger")
    const summary = document.getElementById('summary')
    summary.innerText = props.props.summary
    const importance = document.getElementById('importance')
    importance.innerText = props.props.importance
    const urgency = document.getElementById('urgency')
    urgency.innerText = props.props.urgency
    const infoPanel = document.getElementById('info-panel')
    infoPanel.classList.toggle("info-panel-active")
  }, [hovered]
  )

  return (
    <mesh
      position={[props.props.urgency, props.props.importance, 1]}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <sphereGeometry
        args={[1, 32, 32]} />
      {props.props.active
        ?
        <meshBasicMaterial color="gold"  />
        :
        <meshBasicMaterial color="lightgrey" wireframe />
      }
    </mesh>
  )
}