import React from 'react';
import { SpeedDial, SpeedDialAction, styled } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

const TaskSpeedDial = ({ actions }) => {
    return (
        <StyledSpeedDial
            ariaLabel="Task management options"
            icon={<AssignmentIcon />}
            direction="up"
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
    );
}

export default TaskSpeedDial;

const StyledSpeedDial = styled(SpeedDial)`
  .MuiSpeedDial-fab {
    background-color: #1a237e; /* Indigo */
    
    &:hover {
      background-color: #3949ab; /* Light Indigo */
    }
  }
`;
