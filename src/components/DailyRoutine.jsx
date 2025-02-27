import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DailyRoutineContainer = styled.div`
  max-width: 1820px;
  margin: 20px auto;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  overflow-x: hidden; /* Прибираємо горизонтальний скролінг */
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

const BackButton = styled.button`
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
  margin-top: 120px; /* Зменшено верхній відступ для заповнення простору */
  padding: 20px 0;
  overflow-x: hidden; /* Прибираємо горизонтальний скролінг */
`;

const TabsContainer = styled.div`
  margin-top: 0; /* Вилучено верхній відступ, щоб заповнити простір */
  padding: 20px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px; /* Збережено комфортний відступ */
  justify-content: center; /* Центрування сітки по горизонталі */
  justify-items: center; /* Центрування елементів у сітці */
`;

const TabButton = styled(Link)`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: #fff;
  border: none;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  font-size: 1.2em;
  width: 80%; /* Збережено гармонійний розмір */
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
  &:active {
    transform: scale(0.95);
  }
`;

function DailyRoutine() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <DailyRoutineContainer>
      <Header>
        <BackButton onClick={handleBack} />
        <Title>Daily Routine</Title>
      </Header>
      <RoutineContent>
        <TabsContainer>
          <TabButton to="/daily-routine/pre-session">Pre-Session Journal</TabButton>
          <TabButton to="/daily-routine/post-session">Post-Session Journal</TabButton>
          <TabButton to="/daily-routine/emotions">Emotions & Control</TabButton>
          <TabButton to="/daily-routine/notes">Notes</TabButton>
        </TabsContainer>
      </RoutineContent>
    </DailyRoutineContainer>
  );
}

export default DailyRoutine;