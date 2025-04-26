import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const PsychologyContainer = styled.div`
 
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
  margin-top: 128px;
  padding: 20px;
  color: white;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled(Link)`
  background: #2a2a2a;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  display: block;
  text-decoration: none;
  color: inherit;
  border: 1px solid #5e2ca5;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.2);
  }
`;

const CardTitle = styled.h3`
  color: #5e2ca5;
  margin-bottom: 15px;
  font-size: 1.4em;
`;

const CardDescription = styled.p`
  color: #ccc;
  font-size: 1.1em;
  line-height: 1.5;
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
        <Container>
          <Card to="/learning-section/trading-psychology/mindset-tracker">
            <CardTitle>Mindset Tracker</CardTitle>
            <CardDescription>
              Track your psychological state and progress in developing your trading mindset. 
              Record insights, analyze emotions, and work on improving your psychological 
              preparation.
            </CardDescription>
          </Card>
          
          <Card to="/learning-section/trading-psychology/demons">
            <CardTitle>Trading Demons</CardTitle>
            <CardDescription>
              A catalog of common psychological barriers in trading. Learn to recognize your 
              "demons" and develop strategies to overcome them.
            </CardDescription>
          </Card>
          
          {/* Здесь можно добавить другие карточки для других разделов */}
        </Container>
      </Content>
    </PsychologyContainer>
  );
}

export default TradingPsychology;