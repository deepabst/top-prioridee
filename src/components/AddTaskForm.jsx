import React from "react";
import { useState } from "react";

export default function AddTaskForm(props) {

    const [task, setTask] = useState({});

    function handleSubmit(e) {
        console.log('Form submitted');
        e.preventDefault();

        // TODO: run comparison code to help
        // user set the importance / urgency 
        // of the new task

        // TODO: make an axios request to insert the new 
        // task into the backend and adjust all the other tasks
        // importance/urgency

        // props.addTask(task);
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