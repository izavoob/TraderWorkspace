import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StrategyContainer = styled.div`
 
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  background-color: #1a1a1a;
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
  margin-bottom: 20px;
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
  color: white;
  margin-left: auto;
  margin-right: auto;
`;

const NavButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #7425C9, #B886EE);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 20px 30px;
  margin: 15px auto;
  font-size: 1.2em;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 80%;
  max-width: 400px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(116, 37, 201, 0.4);
  }
  
  &:active {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(116, 37, 201, 0.4);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`;

function Strategy() {
  return (
    <StrategyContainer>
      <Header>
        <BackButton to="/learning-section" title="Back" aria-label="Back" />
        <Title>Strategy Development</Title>
        <Subtitle>Let's develop your strategy!</Subtitle>
      </Header>
      <Content>
        <ButtonContainer>
          <NavButton to="/learning-section/strategy/recommendations">
            Recommendations based on trade statistics
          </NavButton>
          <NavButton to="/learning-section/strategy/cultivation">
            Cultivation of successful patterns
          </NavButton>
        </ButtonContainer>
      </Content>
    </StrategyContainer>
  );
}

export default Strategy;