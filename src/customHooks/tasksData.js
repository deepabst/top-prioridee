// custom hook to load tasks from the backend api
import { useState, useEffect } from "react";
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

function useTasksFromBackend() {
    console.log('Running useTasksFromBackend');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]);

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

    // return custom hook state to the component using this hook
    return { loading, error, tasks }

}
// named export needs a different syntax to default
// e.g.
// import { useTasksFromBackend } from '../customHooks/tasksData';
export { useTasksFromBackend };