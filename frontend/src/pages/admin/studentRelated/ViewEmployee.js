import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { getDepartmentList } from '../../../redux/departmentRelated/departmentHandle';
import { Box, Button, Collapse, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon } from '@mui/icons-material';
import { removeStuff, updateEmployeeFields } from '../../../redux/employeeRelated/employeeHandle';
import { calculateOverallPerformancePercentage, calculateTaskPerformancePercentage, groupPerformanceByTask } from '../../../components/performanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart';
import CustomPieChart from '../../../components/CustomPieChart';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Popup from '../../../components/Popup';

const ViewEmployee = () => {
    const [showTab, setShowTab] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const employeeID = params.id;
    const address = "Employee";

    useEffect(() => {
        dispatch(getUserDetails(employeeID, address));
    }, [dispatch, employeeID]);

    useEffect(() => {
        if (userDetails && userDetails.department && userDetails.department._id !== undefined) {
            dispatch(getDepartmentList(userDetails.department._id, "DepartmentList"));
        }
    }, [dispatch, userDetails]);

    if (response) { console.log(response); }
    else if (error) { console.log(error); }

    const [name, setName] = useState('');
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [password, setPassword] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [employeeCompany, setEmployeeCompany] = useState('');
    const [taskPerformance, setTaskPerformance] = useState([]);
    const [taskScores, setTaskScores] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = (taskId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [taskId]: !prevState[taskId],
        }));
    };

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [selectedSection, setSelectedSection] = useState('table');
    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const fields = password === ""
        ? { name, employeeNumber }
        : { name, employeeNumber, password };

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setEmployeeNumber(userDetails.employeeNumber || '');
            setDepartmentName(userDetails.department || '');
            setEmployeeCompany(userDetails.company || '');
            setTaskPerformance(userDetails.performance || []);
            setTaskScores(userDetails.scores || []);
        }
    }, [userDetails]);

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser(fields, employeeID, address))
            .then(() => {
                dispatch(getUserDetails(employeeID, address));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const deleteHandler = () => {
        setMessage("Sorry, the delete function has been disabled for now.");
        setShowPopup(true);

        // dispatch(deleteUser(employeeID, address))
        //     .then(() => {
        //         navigate(-1)
        //     })
    };

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(employeeID, address));
            });
    };

    const removeTaskPerformance = (taskId) => {
        dispatch(updateEmployeeFields(employeeID, { taskId }, "RemoveEmployeeTaskPerf"))
            .then(() => {
                dispatch(getUserDetails(employeeID, address));
            });
    };

    const overallPerformancePercentage = calculateOverallPerformancePercentage(taskPerformance);
    const overallIncompletePercentage = 100 - overallPerformancePercentage;

    const chartData = [
        { name: 'Completed', value: overallPerformancePercentage },
        { name: 'Incomplete', value: overallIncompletePercentage }
    ];

    const taskData = Object.entries(groupPerformanceByTask(taskPerformance)).map(([taskName, { taskCode, completed, tasks }]) => {
        const taskPerformancePercentage = calculateTaskPerformancePercentage(completed, tasks);
        return {
            task: taskName,
            performancePercentage: taskPerformancePercentage,
            totalTasks: tasks,
            completedTasks: completed
        };
    });

    const EmployeePerformanceSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3>Performance:</h3>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Task</StyledTableCell>
                                <StyledTableCell>Completed</StyledTableCell>
                                <StyledTableCell>Total Tasks</StyledTableCell>
                                <StyledTableCell>Performance Percentage</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        {Object.entries(groupPerformanceByTask(taskPerformance)).map(([taskName, { completed, allData, taskId, tasks }], index) => {
                            const taskPerformancePercentage = calculateTaskPerformancePercentage(completed, tasks);
                            return (
                                <TableBody key={index}>
                                    <StyledTableRow>
                                        <StyledTableCell>{taskName}</StyledTableCell>
                                        <StyledTableCell>{completed}</StyledTableCell>
                                        <StyledTableCell>{tasks}</StyledTableCell>
                                        <StyledTableCell>{taskPerformancePercentage}%</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button variant="contained"
                                                onClick={() => handleOpen(taskId)}>
                                                {openStates[taskId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                            </Button>
                                            <IconButton onClick={() => removeTaskPerformance(taskId)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <Button variant="contained" sx={styles.performanceButton}
                                                onClick={() => navigate(`/Admin/task/employee/performance/${employeeID}/${taskId}`)}>
                                                Change
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={openStates[taskId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Performance Details
                                                    </Typography>
                                                    <Table size="small" aria-label="purchases">
                                                        <TableHead>
                                                            <StyledTableRow>
                                                                <StyledTableCell>Date</StyledTableCell>
                                                                <StyledTableCell align="right">Status</StyledTableCell>
                                                            </StyledTableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {allData.map((data, index) => {
                                                                const date = new Date(data.date);
                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                return (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell component="th" scope="row">
                                                                            {dateString}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                    </StyledTableRow>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )
                        })}
                    </Table>
                    <div>
                        Overall Performance Percentage: {overallPerformancePercentage.toFixed(2)}%
                    </div>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => removeHandler(employeeID, "RemoveEmployeePerf")}>Delete All</Button>
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/employees/employee/performance/" + employeeID)}>
                        Add Performance
                    </Button>
                </>
            )
        }
        const renderChartSection = () => {
            return (
                <>
                    <CustomBarChart chartData={taskData} dataKey="performancePercentage" />
                </>
            )
        }
        return (
            <>
                {taskPerformance && Array.isArray(taskPerformance) && taskPerformance.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                    :
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/employees/employee/performance/" + employeeID)}>
                        Add Performance
                    </Button>
                }
            </>
        )
    }

    const EmployeeScoresSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3>Task Scores:</h3>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Task</StyledTableCell>
                                <StyledTableCell>Score</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {taskScores.map((result, index) => {
                                if (!result.taskName || !result.score) {
                                    return null;
                                }
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{result.taskName.taskName}</StyledTableCell>
                                        <StyledTableCell>{result.score}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/employees/employee/scores/" + employeeID)}>
                        Add Scores
                    </Button>
                </>
            )
        }
        const renderChartSection = () => {
            return (
                <>
                    <CustomBarChart chartData={taskScores} dataKey="score" />
                </>
            )
        }
        return (
            <>
                {taskScores && Array.isArray(taskScores) && taskScores.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                    :
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/employees/employee/scores/" + employeeID)}>
                        Add Scores
                    </Button>
                }
            </>
        )
    }

    const EmployeeDetailsSection = () => {
        return (
            <div>
                Name: {userDetails.name}
                <br />
                Employee Number: {userDetails.employeeNumber}
                <br />
                Department: {departmentName.deptName}
                <br />
                Company: {employeeCompany.companyName}
                {
                    taskPerformance && Array.isArray(taskPerformance) && taskPerformance.length > 0 && (
                        <CustomPieChart data={chartData} />
                    )
                }
                <Button variant="contained" sx={styles.styledButton} onClick={deleteHandler}>
                    Delete
                </Button>
                <br />
            </div>
        )
    }

    return (
        <>
            {loading
                ?
                <>
                    <div>Loading...</div>
                </>
                :
                <>
                    <Box sx={{ width: '100%', typography: 'body1', }} >
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                                    <Tab label="Details" value="1" />
                                    <Tab label="Performance" value="2" />
                                    <Tab label="Scores" value="3" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                                <TabPanel value="1">
                                    <EmployeeDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <EmployeePerformanceSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <EmployeeScoresSection />
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

        </>
    )
}

export default ViewEmployee

const styles = {
    performanceButton: {
        marginLeft: "20px",
        backgroundColor: "#0d47a1",
        "&:hover": {
            backgroundColor: "#1565c0",
        }
    },
    styledButton: {
        margin: "20px",
        backgroundColor: "#004d40",
        "&:hover": {
            backgroundColor: "#00796b",
        }
    }
}
