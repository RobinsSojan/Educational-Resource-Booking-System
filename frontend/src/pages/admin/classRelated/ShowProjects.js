import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProject, getAllProjects } from '../../../redux/projectRelated/projectActions';
import { OrangeButton, RedButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styled from 'styled-components';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowProjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { projectsList, loading, error, getResponse } = useSelector((state) => state.project);
  const { currentUser } = useSelector(state => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllProjects(adminID, "Project"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
    // dispatch(deleteProject(deleteID, address))
    //   .then(() => {
    //     dispatch(getAllProjects(adminID, "Project"));
    //   });
  };

  const projectColumns = [
    { id: 'name', label: 'Project Name', minWidth: 170 },
  ];

  const projectRows = projectsList && projectsList.length > 0 && projectsList.map((project) => {
    return {
      name: project.projectName,
      id: project._id,
    };
  });

  const ProjectButtonHaver = ({ row }) => {
    const actions = [
      { icon: <PostAddIcon />, name: 'Add Tasks', action: () => navigate("/Admin/addtask/" + row.id) },
      { icon: <PersonAddIcon />, name: 'Add Member', action: () => navigate("/Admin/project/addmembers/" + row.id) },
    ];
    return (
      <ButtonContainer>
        <IconButton onClick={() => deleteHandler(row.id, "Project")} color="secondary">
          <DeleteIcon color="error" />
        </IconButton>
        <OrangeButton variant="contained"
          onClick={() => navigate("/Admin/projects/project/" + row.id)}>
          View
        </OrangeButton>
        <ActionMenu actions={actions} />
      </ButtonContainer>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Add Tasks & Members">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <h5>Add</h5>
              <SpeedDialIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: styles.styledPaper,
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {actions.map((action) => (
            <MenuItem onClick={action.action}>
              <ListItemIcon fontSize="small">
                {action.icon}
              </ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const actions = [
    {
      icon: <AddCircleIcon color="primary" />, name: 'Add New Project',
      action: () => navigate("/Admin/addproject")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Projects',
      action: () => deleteHandler(adminID, "Projects")
    },
  ];

  return (
    <>
      {loading ?
        <div>Loading...</div>
        :
        <>
          {getResponse ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <RedButton variant="contained" onClick={() => navigate("/Admin/addproject")}>
                Add Project
              </RedButton>
            </Box>
            :
            <>
              {Array.isArray(projectsList) && projectsList.length > 0 &&
                <TableTemplate buttonHaver={ProjectButtonHaver} columns={projectColumns} rows={projectRows} />
              }
              <SpeedDialTemplate actions={actions} />
            </>}
        </>
      }
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default ShowProjects;

const styles = {
  styledPaper: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  }
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
