import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DailyRoutineContainer = styled.div`
  height: 100%; /* Используем 100% от родителя (body/html) */
  width: 100%;
  background-color: #1a1a1a;
  overflow: hidden; /* Убираем скролл полностью */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
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
  height: 128px; /* Фиксированная высота заголовка */
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

const Title = styled.h1`
  margin: 0 auto;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

const RoutineContent = styled.div`
  margin-top: 128px; /* Учитываем только высоту Header */
  height: calc(100% - 128px); /* Оставшееся пространство после Header */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Убираем скролл внутри */
  box-sizing: border-box;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px; /* Изначальный gap из твоего кода */
  justify-content: center;
  align-items: center;
  width: 720px; /* Изначальная ширина кнопок */
  max-width: 90%; /* Адаптивность для маленьких экранов */
`;

const TabButton = styled(Link)`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: #fff;
  border: none;
  padding: 30px; /* Изначальный padding */
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  font-size: 1.8em;
  width: 100%; /* Адаптивная ширина внутри контейнера */
  height: 180px; /* Изначальная фиксированная высота */
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Добавляем тень как в Header */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Добавляем тень как в Header */
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
  );
}

export default DailyRoutine;