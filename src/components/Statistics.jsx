import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StatisticsContainer = styled.div`
  max-width: 1820px;
  margin: 0 auto;
  height: 100vh;
  background-color: #1a1a1a;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Header = styled.header`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  padding: 20px 0;
  border-radius: 10px 10px 0 0;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 128px;
  min-height: 6.67vh;
  max-height: 128px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
`;

const BackButton = styled(Link)`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border: none;
  padding: 0;
  width: 200px;
  height: 100%;
  border-radius: 0;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transition: all 0.3s ease;
  text-decoration: none;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.98);
  }
  &:before {
    content: "Back";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2em;
    color: rgba(255, 255, 255, 0);
    transition: color 0.3s ease;
  }
  &:hover:before {
    color: #fff;
  }
`;

const PageTitle = styled.h1`
  margin: 0 auto;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-top: 200px;
`;

const StyledButton = styled(Link)`
  background: linear-gradient(135deg, #7425C9 0%, #B886EE 100%);
  border: none;
  border-radius: 15px;
  padding: 20px 40px;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 15px rgba(116, 37, 201, 0.3);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(116, 37, 201, 0.4);
    background: linear-gradient(135deg, #8435D9 0%, #C896FE 100%);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(116, 37, 201, 0.3);
  }
`;

function Statistics() {
  return (
    <StatisticsContainer>
      <Header>
        <BackButton to="/" title="Back to Home" aria-label="Back to Home" />
        <PageTitle>Trading Statistics</PageTitle>
      </Header>
      
      <ButtonsContainer>
        <StyledButton to="/statistics/execution">
          Execution
        </StyledButton>
        <StyledButton to="/statistics/analytics">
          Analytics
        </StyledButton>
      </ButtonsContainer>
    </StatisticsContainer>
  );
}

export default Statistics;