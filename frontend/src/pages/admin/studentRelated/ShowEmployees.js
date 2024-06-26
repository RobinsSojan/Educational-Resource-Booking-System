import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmployees } from '../../../redux/employeeRelated/employeeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Paper, Box, IconButton
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { RedButton, BlueButton, YellowButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popup from '../../../components/Popup';

const ShowEmployees = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { employeesList, loading, error, response } = useSelector((state) => state.employee);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllEmployees(currentUser._id));
    }, [currentUser._id, dispatch]);

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

        // dispatch(deleteUser(deleteID, address))
        //     .then(() => {
        //         dispatch(getAllEmployees(currentUser._id));
        //     })
    }

    const employeeColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'employeeId', label: 'Employee ID', minWidth: 100 },
        { id: 'department', label: 'Department', minWidth: 170 },
    ];

    const employeeRows = employeesList && employeesList.length > 0 && employeesList.map((employee) => {
        return {
            name: employee.name,
            employeeId: employee.employeeId,
            department: employee.department.name,
            id: employee._id,
        };
    });

    const EmployeeButtonHaver = ({ row }) => {
        const options = ['Assign Task', 'View Performance'];

        const [open, setOpen] = useState(false);
        const anchorRef = useRef(null);
        const [selectedIndex, setSelectedIndex] = useState(0);

        const handleClick = () => {
            console.info(`You clicked ${options[selectedIndex]}`);
            if (selectedIndex === 0) {
                handleAssignTask();
            } else if (selectedIndex === 1) {
                handleViewPerformance();
            }
        };

        const handleAssignTask = () => {
            navigate("/Admin/employees/assign-task/" + row.id);
        }
        const handleViewPerformance = () => {
            navigate("/Admin/employees/view-performance/" + row.id);
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
        };

        const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
        };

        const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }

            setOpen(false);
        };
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Employee")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => navigate("/Admin/employees/employee/" + row.id)}>
                    View
                </BlueButton>
                <React.Fragment>
                    <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                        <RedButton
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </RedButton>
                    </ButtonGroup>
                    <Popper
                        sx={{
                            zIndex: 1,
                        }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    disabled={index === 2}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </React.Fragment>
            </>
        );
    };

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Employee',
            action: () => navigate("/Admin/addemployee")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Employees',
            action: () => deleteHandler(currentUser._id, "Employees")
        },
    ];

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {response ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <YellowButton variant="contained" onClick={() => navigate("/Admin/addemployee")}>
                                Add Employee
                            </YellowButton>
                        </Box>
                        :
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            {Array.isArray(employeesList) && employeesList.length > 0 &&
                                <TableTemplate buttonHaver={EmployeeButtonHaver} columns={employeeColumns} rows={employeeRows} />
                            }
                            <SpeedDialTemplate actions={actions} />
                        </Paper>
                    }
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ShowEmployees;
