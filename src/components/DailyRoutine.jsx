import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';

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
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  padding: 20px;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 128px;
  min-height: 6.67vh;
  max-height: 128px;
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
  top: 128px;
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
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: #fff;
  border: none;
  padding: 40px;
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  font-size: 1.8em;
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-sizing: border-box;
  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
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