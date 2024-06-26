import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import { Dashboard, Settings, Logout } from '@mui/icons-material';

const DashboardActions = ({ actions }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
            setIsMobile(isMobileDevice);
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // Initialize the value on the first render
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            {
                isMobile ?
                    <MobileMenu actions={actions} />
                    :
                    <StyledSpeedDial
                        ariaLabel="Dashboard actions"
                        icon={<SpeedDialIcon />}
                        direction="left"
                    >
                        {actions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={action.action}
                            />
                        ))}
                    </StyledSpeedDial>
            }
        </>
    );
};

const MobileMenu = ({ actions }) => {
    return (
        <ul>
            {actions.map((action) => (
                <li key={action.name} onClick={action.action}>
                    {action.name}
                </li>
            ))}
        </ul>
    );
};

const StyledSpeedDial = styled(SpeedDial)`
  .MuiSpeedDial-fab {
    background-color: #283593;
    &:hover {
      background-color: #5c6bc0;
    }
  }
`;

export default DashboardActions;

// Usage example
// const actions = [
//     { icon: <Dashboard />, name: 'Dashboard', action: () => console.log('Dashboard') },
//     { icon: <Settings />, name: 'Settings', action: () => console.log('Settings') },
//     { icon: <Logout />, name: 'Logout', action: () => console.log('Logout') },
// ];

// <DashboardActions actions={actions} />
