import styled from 'styled-components';
import { Button } from '@mui/material';

export const OrangeButton = styled(Button)`
  && {
    background-color: #FFA500;
    color: white;
    margin-left: 4px;
    &:hover {
      background-color: #FF8C00;
      border-color: #FF8C00;
      box-shadow: none;
    }
  }
`;

export const DarkGrayButton = styled(Button)`
  && {
    background-color: #4B4B4B;
    color: white;
    margin-left: 4px;
    &:hover {
      background-color: #3A3A3A;
      border-color: #3A3A3A;
      box-shadow: none;
    }
  }
`;

export const DeepBlueButton = styled(Button)`
  && {
    background-color: #00008B;
    color: white;
    &:hover {
      background-color: #0000CD;
      border-color: #0000CD;
      box-shadow: none;
    }
  }
`;

export const SkyBlueButton = styled(Button)`
  && {
    background-color: #87CEEB;
    color: #fff;
    &:hover {
      background-color: #4682B4;
    }
  }
`;

export const MagentaButton = styled(Button)`
  && {
    background-color: #FF00FF;
    color: #fff;
    &:hover {
      background-color: #D02090;
    }
  }
`;

export const LightPinkButton = styled(Button)`
  && {
    background-color: #FFB6C1;
    color: #fff;
    &:hover {
      background-color: #FF69B4;
    }
  }
`;

export const LimeGreenButton = styled(Button)`
  && {
    background-color: #32CD32;
    color: #fff;
    &:hover {
      background-color: #228B22;
    }
  }
`;

export const TealButton = styled(Button)`
  && {
    background-color: #008080;
    color: white;
    &:hover {
      background-color: #006666;
      border-color: #006666;
      box-shadow: none;
    }
  }
`;

export const NavyBlueButton = styled(Button)`
  && {
    background-color: #000080;
    color: white;
    &:hover {
      background-color: #0000A0;
      border-color: #000090;
      box-shadow: none;
    }
  }
`;
