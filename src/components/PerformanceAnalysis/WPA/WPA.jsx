import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  max-width: 1820px;
  margin: 20px auto;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
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
  margin-top: 148px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1820px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionContainer = styled.div`
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 30px;
  box-sizing: border-box;
  height: fit-content;
  min-width: 0;
`;

const SectionTitle = styled.h2`
  color: rgb(92, 157, 245);
  margin: 0 0 20px;
  font-size: 1.8em;
  text-align: left;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const AnalysisCard = styled.div`
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
  }
`;

const AddAnalysisCard = styled(Link)`
  background-color: rgba(94, 44, 165, 0.1);
  border: 2px dashed #5e2ca5;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  min-height: 200px;

  &:hover {
    background-color: rgba(94, 44, 165, 0.2);
    transform: translateY(-5px);
  }
`;

const AddIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin-bottom: 10px;
`;

const AddText = styled.span`
  font-size: 1.2em;
  color: #b886ee;
`;

const WeekInfo = styled.div`
  font-size: 1.2em;
  color: #b886ee;
  margin-bottom: 15px;
`;

const DateRange = styled.div`
  color: #888;
  margin-bottom: 10px;
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
`;

const MetricLabel = styled.span`
  color: #888;
`;

const MetricValue = styled.span`
  color: ${props => {
    if (props.type === 'missed') return '#9c27b0';
    if (props.color) return props.color;
    return '#fff';
  }};
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
`;

function WPA() {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const data = await window.electronAPI.getPerformanceAnalyses('weekly');
      setAnalyses(data);
    } catch (error) {
      console.error('Error loading analyses:', error);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton to="/performance-analysis" />
        <Title>Weekly Performance Analysis</Title>
        <Subtitle>Let's analyze your weekly performance!</Subtitle>
      </Header>

      <Content>
        <SectionContainer>
          <SectionTitle>Weekly Analysis</SectionTitle>
          <AnalysisGrid>
            <AddAnalysisCard to="/performance-analysis/wpa/create">
              <AddIcon>+</AddIcon>
              <AddText>Add Analysis</AddText>
            </AddAnalysisCard>

            {analyses.map(analysis => (
              <AnalysisCard key={analysis.id}>
                <WeekInfo>Week {analysis.weekNumber}</WeekInfo>
                <DateRange>
                  {new Date(analysis.startDate).toLocaleDateString()} - {new Date(analysis.endDate).toLocaleDateString()}
                </DateRange>
                <MetricsContainer>
                  <MetricRow>
                    <MetricLabel>Total Trades</MetricLabel>
                    <MetricValue>{analysis.totalTrades}</MetricValue>
                  </MetricRow>
                  <MetricRow>
                    <MetricLabel>Missed</MetricLabel>
                    <MetricValue type="missed">{analysis.missedTrades}</MetricValue>
                  </MetricRow>
                  <MetricRow>
                    <MetricLabel>Winrate</MetricLabel>
                    <MetricValue color="#4caf50">{analysis.winrate}%</MetricValue>
                  </MetricRow>
                  <MetricRow>
                    <MetricLabel>Gained RR</MetricLabel>
                    <MetricValue bold>{analysis.gainedRR}</MetricValue>
                  </MetricRow>
                  <MetricRow>
                    <MetricLabel>P&L</MetricLabel>
                    <MetricValue 
                      color={analysis.realisedPL >= 0 ? "#4caf50" : "#ff4444"}
                      bold
                    >
                      ${analysis.realisedPL.toFixed(2)}
                    </MetricValue>
                  </MetricRow>
                </MetricsContainer>
              </AnalysisCard>
            ))}
          </AnalysisGrid>
        </SectionContainer>
      </Content>
    </Container>
  );
}

export default WPA;