import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Paper, Box, IconButton } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { getAllProjects, deleteProject } from '../../../redux/projectRelated/projectActions';
import TableTemplate from '../../../components/TableTemplate';
import { OrangeButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

const ShowProjects = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { projectsList, loading, error, response } = useSelector((state) => state.project);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllProjects(currentUser._id, "Project"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteProject(deleteID, address))
            .then(() => {
                dispatch(getAllProjects(currentUser._id, "Project"));
            });
    };

    const projectColumns = [
        { id: 'name', label: 'Project Name', minWidth: 170 },
        { id: 'description', label: 'Description', minWidth: 100 },
        { id: 'deadline', label: 'Deadline', minWidth: 170 },
    ];

    const projectRows = projectsList && projectsList.length > 0 && projectsList.map((project) => {
        const date = new Date(project.deadline);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            name: project.name,
            description: project.description,
            deadline: dateString,
            id: project._id,
        };
    });

    const ProjectButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Project")}>
                    <DeleteForeverIcon color="error" />
                </IconButton>
            </>
        );
    };

    const actions = [
        {
            icon: <AddBoxIcon color="primary" />, name: 'Add New Project',
            action: () => navigate("/Admin/addproject")
        },
        {
            icon: <DeleteForeverIcon color="error" />, name: 'Delete All Projects',
            action: () => deleteHandler(currentUser._id, "Projects")
        }
    ];

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {response ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <OrangeButton variant="contained"
                                onClick={() => navigate("/Admin/addproject")}>
                                Add Project
                            </OrangeButton>
                        </Box>
                        :
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            {Array.isArray(projectsList) && projectsList.length > 0 &&
                                <TableTemplate buttonHaver={ProjectButtonHaver} columns={projectColumns} rows={projectRows} />
                            }
                            <SpeedDialTemplate actions={actions} />
                        </Paper>
                    }
                </>
            }
        </>
    );
};

export default ShowProjects;
