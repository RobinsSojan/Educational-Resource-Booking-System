import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../../../redux/projectRelated/projectActions';
import { underControl } from '../../../redux/projectRelated/projectSlice';
import { CircularProgress } from '@mui/material';
import Popup from '../../../components/Popup';

const AddTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, response, error } = useSelector(state => state.project);
  const { currentUser } = useSelector(state => state.user);

  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const projectId = currentUser.currentProjectId;

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const fields = { taskName, description, dueDate, projectId };
  const address = "Task";

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addTask(fields, address));
  };

  useEffect(() => {
    if (status === 'added') {
      navigate('/Admin/tasks');
      dispatch(underControl());
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
          <label>Task Name</label>
          <input className="addTaskInput" type="text" placeholder="Enter task name..."
            value={taskName}
            onChange={(event) => setTaskName(event.target.value)}
            required />

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
};

export default AddTask;
