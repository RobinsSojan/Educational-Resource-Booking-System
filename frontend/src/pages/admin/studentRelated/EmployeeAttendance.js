import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getDepartmentList } from '../../../redux/departmentRelated/departmentHandle';
import { updateEmployeeFields } from '../../../redux/employeeRelated/employeeHandle';

import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl
} from '@mui/material';
import { BlueButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';

const EmployeeAttendance = ({ context }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { departmentsList } = useSelector((state) => state.department);
    const { response, error, statestatus } = useSelector((state) => state.employee);
    const params = useParams()

    const [employeeID, setEmployeeID] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [chosenDeptName, setChosenDeptName] = useState("");
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (context === "Employee") {
            setEmployeeID(params.id);
            const empID = params.id
            dispatch(getUserDetails(empID, "Employee"));
        }
        else if (context === "Department") {
            const { employeeID, departmentID } = params
            setEmployeeID(employeeID);
            dispatch(getUserDetails(employeeID, "Employee"));
            setChosenDeptName(departmentID);
        }
    }, [context]);

    useEffect(() => {
        if (userDetails && userDetails.department && context === "Employee") {
            dispatch(getDepartmentList(userDetails.department._id, "DepartmentList"));
        }
    }, [dispatch, userDetails]);

    const changeHandler = (event) => {
        const selectedDepartment = departmentsList.find(
            (department) => department.deptName === event.target.value
        );
        setDepartmentName(selectedDepartment.deptName);
        setChosenDeptName(selectedDepartment._id);
    }

    const fields = { deptName: chosenDeptName, status, date }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateEmployeeFields(employeeID, fields, "EmployeeAttendance"))
    }

    useEffect(() => {
        if (response) {
            setLoader(false)
            setShowPopup(true)
            setMessage(response)
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("error")
        }
        else if (statestatus === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Done Successfully")
        }
    }, [response, statestatus, error])

    return (
        <>
            {loading
                ?
                <>
                    <div>Loading...</div>
                </>
                :
                <>
                    <Box
                        sx={{
                            flex: '1 1 auto',
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                maxWidth: 550,
                                px: 3,
                                py: '100px',
                                width: '100%'
                            }}
                        >
                            <Stack spacing={1} sx={{ mb: 3 }}>
                                <Typography variant="h4">
                                    Employee Name: {userDetails.name}
                                </Typography>
                                {currentUser.assignedDepartment &&
                                    <Typography variant="h4">
                                        Department Name: {currentUser.assignedDepartment?.deptName}
                                    </Typography>
                                }
                            </Stack>
                            <form onSubmit={submitHandler}>
                                <Stack spacing={3}>
                                    {
                                        context === "Employee" &&
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Select Department</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={departmentName}
                                                label="Choose an option"
                                                onChange={changeHandler} required
                                            >
                                                {departmentsList ?
                                                    departmentsList.map((department, index) => (
                                                        <MenuItem key={index} value={department.deptName}>
                                                            {department.deptName}
                                                        </MenuItem>
                                                    ))
                                                    :
                                                    <MenuItem value="Select Department">
                                                        Add Departments for Attendance
                                                    </MenuItem>
                                                }
                                            </Select>
                                        </FormControl>
                                    }
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Attendance Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={status}
                                            label="Choose an option"
                                            onChange={(event) => setStatus(event.target.value)}
                                            required
                                        >
                                            <MenuItem value="Present">Present</MenuItem>
                                            <MenuItem value="Absent">Absent</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            label="Select Date"
                                            type="date"
                                            value={date}
                                            onChange={(event) => setDate(event.target.value)} required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </FormControl>
                                </Stack>

                                <BlueButton
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    variant="contained"
                                    type="submit"
                                    disabled={loader}
                                >
                                    {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                                </BlueButton>
                            </form>
                        </Box>
                    </Box>
                    <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                </>
            }
        </>
    )
}

export default EmployeeAttendance
