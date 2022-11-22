import React from "react";
import { Canvas } from '@react-three/fiber'
import Task from './Task';
// import AddTaskForm from "./AddTaskForm";
import { useState } from "react";

export default function AddTaskDialog(props) {
  
  const [task, setTask] = useState({});

  function selectMiddleIndex(arr) {
    const halvedIndex = Math.floor(arr.length / 2);
    return halvedIndex;
  }

  function handleInput(e) {
    // console.log('Input', e.target.value);
    setTask({
        ...task, // copy the existing state 
        [e.target.name]: e.target.value // add the new stuff
    });
  }

    function handleSubmit(e) {
      console.log('Form submitted');
      e.preventDefault();
      props.dialogVisibility(false);

      // TODO: run comparison code to help
      // user set the importance / urgency 
      // of the new task

      // TODO: make an axios request to insert the new 
      // task into the backend and adjust all the other tasks
      // importance/urgency

      // props.addTask(task);
  }

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
        <form onSubmit={handleSubmit}>
                <div>
                    <label>What needs to be done?</label>
                    <input name="summary" type="text" onChange={handleInput} />
                </div>
                <button>Add Task</button>
            </form>
          {/* <AddTaskForm addTask={props.addTask} deactivateAllTasks={props.deactivateAllTasks} dialogVisibility={props.dialogVisibility} /> */}
        </div>
      </div>
    );
  }