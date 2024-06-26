import React from 'react';
import styled from 'styled-components';

const MaintenancePage = () => {
    return (
        <Wrapper>
            <MessageContainer>
                <Title>We're Under Maintenance</Title>
                <Message>
                    Our website is currently undergoing scheduled maintenance. We should be back shortly. Thank you for your patience.
                </Message>
            </MessageContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: "Arial", sans-serif;
  color: #000;
  background-image: url('https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  background-size: cover;
  background-position: center;
`;

const MessageContainer = styled.div`
  max-width: 800px;
  padding: 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
`;

const Title = styled.h1`
  margin-bottom: 40px;
  font-size: 36px;
  font-weight: bold;
  color: #ff5722;
`;

const Message = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: #333;
`;

export default MaintenancePage;
