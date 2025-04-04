import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

// Анимации
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Глобальные стили
const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-color: #1a1a1a;
    overflow-x: hidden;
    overflow-y: hidden;
    font-family: 'Inter', sans-serif;
  }
  
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #7425C9;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #5e2ca5;
  }
`;

// Компоненты стилей
const Container = styled.div`
  max-width: 1820px;
  margin: 0 auto;
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
  margin: 0 auto;
  width: 95%;
  max-width: 1700px;
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

const BackButton = styled.button`
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

const Content = styled.div`
  margin-top: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 20px;
  width: 100%;
  max-width: 1000px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  background: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
    border-color: #B886EE;
    background: linear-gradient(rgba(46, 46, 46, 0.8), rgba(46, 46, 46, 0.8)), 
                linear-gradient(45deg, rgba(116, 37, 201, 0.2), rgba(184, 134, 238, 0.2));
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #7425C9, #B886EE, #7425C9);
    background-size: 200% 100%;
    animation: ${gradientAnimation} 3s ease infinite;
  }
`;

const CardIcon = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #fff;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #ccc;
  margin: 0;
`;

function DailyRoutine() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <BackButton onClick={handleBack} />
          <Title>Daily Routine</Title>
          <Subtitle>Let's create your daily routine!</Subtitle>
        </Header>
        
        <Content>
          <CardsContainer>
            <Card to="/daily-routine/pre-session">
              <CardIcon>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H7C5.89543 4 5 4.89543 5 6V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V14" 
                    stroke="#B886EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 3.5V7.5C14 8.05228 14.4477 8.5 15 8.5H19" 
                    stroke="#7425C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.5 11L9.5 17L7 14.5" 
                    stroke="#B886EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 13L19 8" 
                    stroke="#7425C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </CardIcon>
              <CardTitle>Pre-Session Journal</CardTitle>
              <CardDescription>
                Plan your trading day ahead with detailed market analysis and trading expectations.
              </CardDescription>
            </Card>
            
            <Card to="/daily-routine/post-session">
              <CardIcon>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5Z" 
                    stroke="#B886EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V6" 
                    stroke="#7425C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 2V6" 
                    stroke="#7425C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 10H20" 
                    stroke="#B886EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 15H10" 
                    stroke="#7425C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 15H14" 
                    stroke="#7425C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 18H10" 
                    stroke="#B886EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 18H14" 
                    stroke="#B886EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </CardIcon>
              <CardTitle>Post-Session Journal</CardTitle>
              <CardDescription>
                Review and analyze your trading performance after market closure.
              </CardDescription>
            </Card>
          </CardsContainer>
        </Content>
      </Container>
    </>
  );
}

export default DailyRoutine;