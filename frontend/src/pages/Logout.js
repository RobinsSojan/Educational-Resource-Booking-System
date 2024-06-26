import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import styled from 'styled-components';

const Logout = () => {
    const currentUser = useSelector(state => state.user.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <LogoutContainer>
            <h1>{currentUser.name}</h1>
            <LogoutMessage>Are you sure you want to log out of your account?</LogoutMessage>
            <LogoutButtonLogout onClick={handleLogout}>Log Out</LogoutButtonLogout>
            <LogoutButtonCancel onClick={handleCancel}>Cancel</LogoutButtonCancel>
        </LogoutContainer>
    );
};

export default Logout;

const LogoutContainer = styled.div`
  border: 2px solid #333;
  border-radius: 15px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  background-color: #f0f4f8;
  color: #333;
`;

const LogoutMessage = styled.p`
  margin-bottom: 25px;
  font-size: 18px;
  text-align: center;
  color: #555;
`;

const LogoutButton = styled.button`
  padding: 12px 25px;
  margin-top: 12px;
  border-radius: 8px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  border: none;

  &:hover {
    color: #fff;
    background-color: #444;
  }
`;

const LogoutButtonLogout = styled(LogoutButton)`
  background-color: #007bff;
`;

const LogoutButtonCancel = styled(LogoutButton)`
  background-color: #6c757d;
`;
