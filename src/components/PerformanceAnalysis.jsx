import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shineEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const PerformanceContainer = styled.div`
  max-width: 1820px;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const Header = styled.header`
  background: linear-gradient(45deg, #7425C9, #B886EE, #7425C9);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  padding: 20px 0;
  border-radius: 8px;
  color: #fff;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
  min-height: 6.67vh;
  max-height: 128px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled(Link)`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border: none;
  padding: 0;
  width: 200px;
  height: 100%;
  border-radius: 8px;
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

const Title = styled.h1`
  margin: 0;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;
const Subtitle = styled.h2`
  margin: 5px auto 0;
  font-size: 1.2em;
  color: #ff8c00;
  text-align: center;
  z-index: 1;
  font-weight: normal;
`;

const PerformanceContent = styled.div`
  margin-top: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const TabsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1500px;
`;

const TabButton = styled(Link)`
  background-color: #5e2ca5;
  color: #fff;
  border: none;
  padding: 30px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.8em;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  isolation: isolate;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    background-size: 200% 100%;
    border-radius: 15px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: #4a1a8d;
    transform: scale(1.05);
    
    &::before {
      opacity: 1;
      animation: ${shineEffect} 1.5s linear infinite;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

function PerformanceAnalysis() {
  return (
    <PerformanceContainer>
      <Header>
        <BackButton to="/" title="Back to Home" aria-label="Back to Home" />
        <Title>Performance Analysis</Title>
        <Subtitle>Let's analyze your performance!</Subtitle>
      </Header>
      <PerformanceContent>
        <TabsContainer>
          <TabButton to="/performance-analysis/wpa">Weekly Performance Analysis</TabButton>
          <TabButton to="/performance-analysis/mpa">Monthly Performance Analysis</TabButton>
          <TabButton to="/performance-analysis/qpa">Quarterly Performance Analysis</TabButton>
          <TabButton to="/performance-analysis/ypa">Yearly Performance Analysis</TabButton>
        </TabsContainer>
      </PerformanceContent>
    </PerformanceContainer>
  );
}

export default PerformanceAnalysis;