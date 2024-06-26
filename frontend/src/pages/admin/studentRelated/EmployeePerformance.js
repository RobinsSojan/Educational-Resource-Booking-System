import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getDepartmentList } from '../../../redux/departmentRelated/departmentHandle';
import { updateEmployeeFields } from '../../../redux/employeeRelated/employeeHandle';

import Popup from '../../../components/Popup';
import { GreenButton } from '../../../components/buttonStyles';
import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl
} from '@mui/material';

const EmployeePerformance = ({ context }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { departmentsList } = useSelector((state) => state.department);
    const { response, error, statestatus } = useSelector((state) => state.employee);
    const params = useParams()

    const [employeeID, setEmployeeID] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [chosenDeptName, setChosenDeptName] = useState("");
    const [performanceScore, setPerformanceScore] = useState("");

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

    const fields = { deptName: chosenDeptName, performanceScore }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateEmployeeFields(employeeID, fields, "UpdatePerformance"))
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
                                            <InputLabel id="demo-simple-select-label">
                                                Select Department
                                            </InputLabel>
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
                                                        Add Departments For Performance
                                                    </MenuItem>
                                                }
                                            </Select>
                                        </FormControl>
                                    }
                                    <FormControl>
                                        <TextField type="number" label='Enter Performance Score'
                                            value={performanceScore} required
                                            onChange={(e) => setPerformanceScore(e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </FormControl>
                                </Stack>
                                <GreenButton
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    variant="contained"
                                    type="submit"
                                    disabled={loader}
                                >
                                    {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                                </GreenButton>
                            </form>
                        </Box>
                    </Box>
                    <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                </>
            }
        </>
    )
}

export default EmployeePerformance
