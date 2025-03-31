import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

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

const PsychologyContainer = styled.div`
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
  height: auto;
  min-height: 6.67vh;
  max-height: 100px;
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

function TradingPsychology() {
  return (
    <PsychologyContainer>
      <Header>
        <BackButton to="/learning-section" title="Back" aria-label="Back" />
        <Title>Trading Psychology</Title>
        <Subtitle>Let's learn about trading psychology!</Subtitle>
      </Header>
      <Content>
        <CardsContainer>
          <Card to="/learning-section/trading-psychology/mindset-tracker">
            <CardIcon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C7 4.5 4.5 8 4.5 11.5C4.5 15 7 17.5 9 17.5C11 17.5 10.5 16 12 16C13.5 16 13 17.5 15 17.5C17 17.5 19.5 15 19.5 11.5C19.5 8 17 4.5 12 4.5Z" 
                  stroke="#B886EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11C7 11 8 9.5 9.5 9.5C11 9.5 13 11 14.5 11C16 11 17 10 17 10" 
                  stroke="#B886EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 13C7 13 8.5 14.5 10 14.5C11.5 14.5 12.5 13 14 13C15.5 13 17 14 17 14" 
                  stroke="#B886EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 7.5C8.5 7.5 10 8.5 12 8.5C14 8.5 15.5 7.5 15.5 7.5" 
                  stroke="#7425C9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="0.5" stroke="#7425C9" strokeWidth="1.5"/>
                <circle cx="15" cy="7" r="0.5" stroke="#7425C9" strokeWidth="1.5"/>
                <circle cx="12" cy="6" r="0.5" stroke="#7425C9" strokeWidth="1.5"/>
                <path d="M4.5 11.5C4.5 6.5 8 3.5 12 3.5C16 3.5 19.5 6.5 19.5 11.5C19.5 16.5 16 19.5 12 19.5C8 19.5 4.5 16.5 4.5 11.5Z" 
                  stroke="#7425C9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19.5V21" stroke="#B886EE" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 18.5L7 20" stroke="#B886EE" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16 18.5L17 20" stroke="#B886EE" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </CardIcon>
            <CardTitle>Mindset Tracker</CardTitle>
            <CardDescription>
              Track your psychological state and progress in developing your trading mindset. 
              Record insights, analyze emotions, and work on improving your psychological 
              preparation.
            </CardDescription>
          </Card>
          
          <Card to="/learning-section/trading-psychology/demons">
            <CardIcon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C7 3 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z" 
                  stroke="#B886EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6C8 6 9 4 12 4C15 4 16 6 16 6" 
                  stroke="#7425C9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 5L9 7" stroke="#7425C9" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 5L15 7" stroke="#7425C9" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M9 10C9.55228 10 10 9.55228 10 9C10 8.44772 9.55228 8 9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10Z" 
                  fill="#B886EE"/>
                <path d="M15 10C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8C14.4477 8 14 8.44772 14 9C14 9.55228 14.4477 10 15 10Z" 
                  fill="#B886EE"/>
                <path d="M8 14C8 14 10 16 12 16C14 16 16 14 16 14" 
                  stroke="#B886EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 14L10 12" stroke="#7425C9" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M15 14L14 12" stroke="#7425C9" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7 11C7 11 8 13 9 13" stroke="#B886EE" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 11C17 11 16 13 15 13" stroke="#B886EE" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 18C12 18 15 17 16 15" stroke="#7425C9" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.5 2"/>
                <path d="M12 18C12 18 9 17 8 15" stroke="#7425C9" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.5 2"/>
              </svg>
            </CardIcon>
            <CardTitle>Trading Demons</CardTitle>
            <CardDescription>
              A catalog of common psychological barriers in trading. Learn to recognize your 
              "demons" and develop strategies to overcome them.
            </CardDescription>
          </Card>
        </CardsContainer>
      </Content>
    </PsychologyContainer>
  );
}

export default TradingPsychology;