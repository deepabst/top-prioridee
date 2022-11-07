// React component to display results of the backend call for data
import React, { useState, useEffect } from 'react';
import { fetchTasksFromBackend } from '../customHooks/tasksData';

function TaskList() {

  const { loading, tasks, error } = fetchTasksFromBackend();

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
export default TaskList;

