import React from "react";
import { Canvas } from '@react-three/fiber'
import Task from './Task';
import AddTaskForm from "./AddTaskForm";

export default function AddTaskDialog(props) {
    return (
      <div className='add-task-dialog'>
        <h2>Add new task</h2>
        <div className='add-task-canvas'>
          <Canvas>
            <ambientLight intensity={1.5} />
            <spotLight intensity={3} position={[40, 40, 40]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Task props={{ urgency: 0, importance: 0, active: false }} />
          </Canvas>
        </div>
        <div>
          <AddTaskForm addTask={props.addTask} deactivateAllTasks={props.deactivateAllTasks} />
        </div>
      </div>
    );
  }