import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ReportingSystemContainer = styled.div`
 
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
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SectionTitle = styled.h2`
  color: rgb(92, 157, 245);
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

function ReportingSystem() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <ReportingSystemContainer>
      <Header>
        <BackButton onClick={handleBack} />
        <Title>Reporting System</Title>
        <Subtitle>Let's create your reports!</Subtitle>
      </Header>
      <Content>
        <SectionTitle>Reporting Tools</SectionTitle>
        <Card>
          <PlaceholderText>
            This section will generate detailed reports on your trading performance, including PDF exports and customizable dashboards. Coming soon with advanced reporting features.
          </PlaceholderText>
        </Card>
        <Card>
          <PlaceholderText>
            Add features like monthly, quarterly, and yearly reports, as well as export options for external analysis.
          </PlaceholderText>
        </Card>
      </Content>
    </ReportingSystemContainer>
  );
}

export default ReportingSystem;