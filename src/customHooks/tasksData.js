// React hook to go fetch the task data from the backend
import { useState, useEffect } from "react";
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

function fetchTasksFromBackend() {

    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {

        setLoading(true); // loading the tasks from the server
        axios.get(`${BASE_URL}/tasks`)
            .then(res => {
                    // console.log('data', res.data);
                    setLoading(false);
                    setTasks(res.data);
                }
            )
            .catch(err => {
                console.log(`Error loading tasks`, err);
                setError(err);
                setLoading(false);

            })
    }, [])

    // console.log(`Tasks state is:`, tasks);

    return {loading, tasks, error}

}
// named export needs a different syntax to default
// e.g.
// import { fetchTasksFromBackend } from '../customHooks/tasksData';
export { fetchTasksFromBackend };