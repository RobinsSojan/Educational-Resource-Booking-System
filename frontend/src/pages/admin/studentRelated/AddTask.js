import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerTask } from '../../../redux/projectRelated/projectActions';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/projectRelated/projectSlice';
import { getAllProjects } from '../../../redux/projectRelated/projectActions';
import { CircularProgress } from '@mui/material';

const AddTask = ({ context }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const projectState = useSelector(state => state.project);
    const { status, currentUser, response, error } = projectState;
    const { projectsList } = useSelector((state) => state.project);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectId, setProjectId] = useState('');

    const managerId = currentUser._id;
    const role = "Task";

    useEffect(() => {
        if (context === "Project") {
            setProjectId(params.id);
        }
    }, [params.id, context]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        dispatch(getAllProjects(managerId, "Project"));
    }, [managerId, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Project') {
            setProjectName('Select Project');
            setProjectId('');
        } else {
            const selectedProject = projectsList.find(
                (projectItem) => projectItem.name === event.target.value
            );
            setProjectName(selectedProject.name);
            setProjectId(selectedProject._id);
        }
    };

    const fields = { title, description, dueDate, projectId, managerId, role };

    const submitHandler = (event) => {
        event.preventDefault();
        if (projectId === "") {
            setMessage("Please select a project");
            setShowPopup(true);
        } else {
            setLoader(true);
            dispatch(registerTask(fields, role));
        }
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate(-1);
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <>
            <div className="addTask">
                <form className="addTaskForm" onSubmit={submitHandler}>
                    <span className="addTaskTitle">Add Task</span>
                    <label>Title</label>
                    <input className="addTaskInput" type="text" placeholder="Enter task title..."
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        autoComplete="title" required />

                    {
                        context === "Task" &&
                        <>
                            <label>Project</label>
                            <select
                                className="addTaskInput"
                                value={projectName}
                                onChange={changeHandler} required>
                                <option value='Select Project'>Select Project</option>
                                {projectsList.map((projectItem, index) => (
                                    <option key={index} value={projectItem.name}>
                                        {projectItem.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    }

                    <label>Description</label>
                    <input className="addTaskInput" type="text" placeholder="Enter task description..."
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required />

                    <label>Due Date</label>
                    <input className="addTaskInput" type="date" placeholder="Enter due date..."
                        value={dueDate}
                        onChange={(event) => setDueDate(event.target.value)}
                        required />

                    <button className="addTaskButton" type="submit" disabled={loader}>
                        {loader ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Add'
                        )}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
}

export default AddTask;
