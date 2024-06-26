import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled from 'styled-components';
import SchoolImage from "../assets/school_image.svg";
import { BlueButton } from '../components/buttonStyles';

const Homepage = () => {
    return (
        <StyledContainer>
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <img src={SchoolImage} alt="school" style={{ width: '100%' }} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <StyledPaper elevation={3}>
                        <StyledTitle>
                            Welcome to
                            <br />
                            EduManage
                        </StyledTitle>
                        <StyledText>
                            Simplify educational administration, organize classrooms, and manage students and staff efficiently.
                            Monitor attendance, evaluate performance, and deliver constructive feedback.
                            Easily access records, review grades, and communicate effectively.
                        </StyledText>
                        <StyledBox>
                            <StyledLink to="/choose">
                                <BlueButton variant="contained" fullWidth>
                                    Login
                                </BlueButton>
                            </StyledLink>
                            <StyledLink to="/chooseasguest">
                                <Button variant="outlined" fullWidth
                                    sx={{ mt: 2, mb: 3, color: "#00539CFF", borderColor: "#00539CFF" }}
                                >
                                    Login as Guest
                                </Button>
                            </StyledLink>
                            <StyledText>
                                Don't have an account?{' '}
                                <Link to="/Adminregister" style={{color:"#0078d7"}}>
                                    Sign up
                                </Link>
                            </StyledText>
                        </StyledBox>
                    </StyledPaper>
                </Grid>
            </Grid>
        </StyledContainer>
    );
};

export default Homepage;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #f0f8ff, #e6f2ff);
`;

const StyledPaper = styled.div`
  padding: 24px;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  gap: 16px;
  padding: 24px;
`;

const StyledTitle = styled.h1`
  font-size: 3rem;
  color: #00539CFF;
  font-weight: bold;
  padding-top: 0;
  letter-spacing: normal;
  line-height: normal;
`;

const StyledText = styled.p`
  color: #0078d7;
  margin-top: 30px;
  margin-bottom: 30px; 
  letter-spacing: normal;
  line-height: normal;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;
