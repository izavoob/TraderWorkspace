import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PerformanceAnalysisContainer = styled.div`
  max-width: 1820px;
  margin: 20px auto;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
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
  position: absolutely;
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
    content: 'Back';
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

const Content = styled.div`
  margin-top: 148px; /* Зсув для обходу фіксованого Header */
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SectionTitle = styled.h2`
  color: rgb(92, 157, 245); /* Синій колір, як у лабелів у CreateTrade */
  margin: 20px 0 10px;
  font-size: 2em;
  text-align: center;
`;

const Card = styled.div`
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #5e2ca5;
  margin-bottom: 20px;
  width: 80%;
  max-width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const PlaceholderText = styled.p`
  color: #fff;
  font-size: 1.2em;
  text-align: center;
`;

function PerformanceAnalysis() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <PerformanceAnalysisContainer>
      <Header>
        <BackButton onClick={handleBack} />
        <Title>Performance Analysis</Title>
      </Header>
      <Content>
        <SectionTitle>Performance Overview</SectionTitle>
        <Card>
          <PlaceholderText>
            This section will display detailed performance metrics, including profit/loss, win rate, and trade efficiency. Coming soon with interactive charts and data analysis tools.
          </PlaceholderText>
        </Card>
        <Card>
          <PlaceholderText>
            Add features like trade history visualization, performance trends, and comparison with market benchmarks.
          </PlaceholderText>
        </Card>
      </Content>
    </PerformanceAnalysisContainer>
  );
}

export default PerformanceAnalysis;