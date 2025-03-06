import React from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shineEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Добавляем глобальные стили для скрытия скролла
const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const DailyRoutineContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1a1a1a;
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.header`
  background: linear-gradient(45deg, #7425C9, #B886EE, #7425C9);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled(Link)`
  background: rgba(0, 0, 0, 0.2);
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

const Title = styled.h1`
  margin: 0 auto;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

const RoutineContent = styled.div`
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 20px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;
  width: 800px;
  max-width: 95%;
  height: 100%;
  max-height: calc(100vh - 168px);
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled(Link)`
  background-color: #5e2ca5;
  color: #fff;
  border: none;
  padding: 30px;
  border-radius: 15px;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.8em;
  height: 180px;
  width: 1250px;
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

function DailyRoutine() {
  return (
    <>
      <GlobalStyle />
      <DailyRoutineContainer>
        <Header>
          <BackButton to="/" title="Back to Home" aria-label="Back to Home" />
          <Title>Daily Routine</Title>
        </Header>
        <RoutineContent>
          <TabsContainer>
            <TabButton to="/daily-routine/pre-session">Pre-Session Journal</TabButton>
            <TabButton to="/daily-routine/post-session">Post-Session Journal</TabButton>
          </TabsContainer>
        </RoutineContent>
      </DailyRoutineContainer>
    </>
  );
}

export default DailyRoutine;