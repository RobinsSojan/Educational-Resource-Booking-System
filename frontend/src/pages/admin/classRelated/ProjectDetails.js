import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getProjectDetails, getProjectTasks, getTeamMembers } from "../../../redux/projectRelated/projectActions";
import { deleteUser } from '../../../redux/userRelated/userActions';
import {
    Box, Container, Typography, Tab, IconButton
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetTasks } from "../../../redux/projectRelated/projectSlice";
import { RedButton, OrangeButton, BlueButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';

const ProjectDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { tasksList, teamMembers, projectDetails, loading, error, response, getResponse } = useSelector((state) => state.project);

    const projectId = params.id

    useEffect(() => {
        dispatch(getProjectDetails(projectId, "Project"));
        dispatch(getProjectTasks(projectId, "ProjectTasks"))
        dispatch(getTeamMembers(projectId));
    }, [dispatch, projectId])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteId, address) => {
        console.log(deleteId);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
        // dispatch(deleteUser(deleteId, address))
        //     .then(() => {
        //         dispatch(getTeamMembers(projectId));
        //         dispatch(resetTasks())
        //         dispatch(getProjectTasks(projectId, "ProjectTasks"))
        //     })
    }

    const taskColumns = [
        { id: 'name', label: 'Task Name', minWidth: 170 },
        { id: 'code', label: 'Task Code', minWidth: 100 },
    ]

    const taskRows = tasksList && tasksList.length > 0 && tasksList.map((task) => {
        return {
            name: task.taskName,
            code: task.taskCode,
            id: task._id,
        };
    })

    const TasksButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Task")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/project/task/${projectId}/${row.id}`)
                    }}
                >
                    View
                </BlueButton >
            </>
        );
    };

    const taskActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Task',
            action: () => navigate("/Admin/addtask/" + projectId)
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Tasks',
            action: () => deleteHandler(projectId, "TasksProject")
        }
    ];

    const ProjectTasksSection = () => {
        return (
            <>
                {response ?
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <OrangeButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addtask/" + projectId)}
                        >
                            Add Tasks
                        </OrangeButton>
                    </Box>
                    :
                    <>
                        <Typography variant="h5" gutterBottom>
                            Tasks List:
                        </Typography>

                        <TableTemplate buttonHaver={TasksButtonHaver} columns={taskColumns} rows={taskRows} />
                        <SpeedDialTemplate actions={taskActions} />
                    </>
                }
            </>
        )
    }

    const memberColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'role', label: 'Role', minWidth: 100 },
    ]

    const memberRows = teamMembers.map((member) => {
        return {
            name: member.name,
            role: member.role,
            id: member._id,
        };
    })

    const MembersButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Member")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/members/member/" + row.id)}
                >
                    View
                </BlueButton>
                <RedButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/members/member/tasks/" + row.id)
                    }
                >
                    Tasks
                </RedButton>
            </>
        );
    };

    const memberActions = [
        {
            icon: <PersonAddIcon color="primary" />, name: 'Add New Member',
            action: () => navigate("/Admin/project/addmembers/" + projectId)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Members',
            action: () => deleteHandler(projectId, "MembersProject")
        },
    ];

    const ProjectMembersSection = () => {
        return (
            <>
                {getResponse ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <OrangeButton
                                variant="contained"
                                onClick={() => navigate("/Admin/project/addmembers/" + projectId)}
                            >
                                Add Members
                            </OrangeButton>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Members List:
                        </Typography>

                        <TableTemplate buttonHaver={MembersButtonHaver} columns={memberColumns} rows={memberRows} />
                        <SpeedDialTemplate actions={memberActions} />
                    </>
                )}
            </>
        )
    }

    const ProjectSummarySection = () => {
        const numberOfTasks = tasksList.length;
        const numberOfMembers = teamMembers.length;

        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Project Summary
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Project: {projectDetails && projectDetails.projectName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Tasks: {numberOfTasks}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Members: {numberOfMembers}
                </Typography>
                {getResponse &&
                    <OrangeButton
                        variant="contained"
                        onClick={() => navigate("/Admin/project/addmembers/" + projectId)}
                    >
                        Add Members
                    </OrangeButton>
                }
                {response &&
                    <OrangeButton
                        variant="contained"
                        onClick={() => navigate("/Admin/addtask/" + projectId)}
                    >
                        Add Tasks
                    </OrangeButton>
                }
            </>
        );
    }

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Box sx={{ width: '100%', typography: 'body1', }} >
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                                    <Tab label="Summary" value="1" />
                                    <Tab label="Tasks" value="2" />
                                    <Tab label="Members" value="3" />
                                    <Tab label="Reports" value="4" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                                <TabPanel value="1">
                                    <ProjectSummarySection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <ProjectTasksSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <ProjectMembersSection />
                                </TabPanel>
                                <TabPanel value="4">
                                    Reports
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ProjectDetails;
