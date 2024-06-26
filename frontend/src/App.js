import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Homepage from './pages/Homepage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import LoginPage from './pages/LoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import ChooseUser from './pages/ChooseUser';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f5f5f5;
    color: #333;
    font-family: Arial, sans-serif;
  }
`;

const theme = {
  colors: {
    primary: '#004d99',
    secondary: '#ffcc00',
    background: '#f5f5f5',
    text: '#333',
    button: {
      background: '#004d99',
      text: '#fff',
    },
    buttonHover: {
      background: '#003366',
      text: '#fff',
    },
  },
};

const AppContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const App = () => {
  const { currentRole } = useSelector(state => state.user);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        {currentRole === null ? (
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/choose" element={<ChooseUser visitor="normal" />} />
            <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} />

            <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
            <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
            <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />

            <Route path="/Adminregister" element={<AdminRegisterPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <AppContainer>
            {currentRole === 'Admin' && <AdminDashboard />}
            {currentRole === 'Student' && <StudentDashboard />}
            {currentRole === 'Teacher' && <TeacherDashboard />}
          </AppContainer>
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App;
