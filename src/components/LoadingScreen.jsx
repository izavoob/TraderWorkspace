import React from 'react';
import styled, { keyframes } from 'styled-components';
import { PulseLoader } from 'react-spinners';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LoadingScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.5s ease-in;
`;

const LoadingText = styled.h2`
  color: #fff;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
`;

const SubText = styled.p`
  color: #B886EE;
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
  max-width: 80%;
  line-height: 1.5;
`;

const LoadingScreen = () => {
  return (
    <LoadingScreenContainer>
      <LoadingText>Loading Trader Workspace</LoadingText>
      <PulseLoader 
        color="#7425C9"
        size={15}
        margin={2}
        speedMultiplier={0.8}
      />
      <SubText>
        Please wait while we're preparing your trading environment...
      </SubText>
    </LoadingScreenContainer>
  );
};

export default LoadingScreen;