// React component to display results of the backend call for data
import React, { useState, useEffect } from 'react';
import { useTasksFromBackend } from '../customHooks/tasksData';

export default function TaskList() {

  const { loading, error, tasks } = useTasksFromBackend();

  return (
    <div className='tasklist'>
      {
        loading
          ?
          <p>Loading tasks...</p>
          :
          (
            <ul>
              {
                tasks.map((task) =>
                  <li key={task._id}>
                      {task.summary}
                  </li>
                )}
            </ul>
          )
      }
    </div>
  );
}