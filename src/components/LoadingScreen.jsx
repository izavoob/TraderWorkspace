import React from 'react';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(45deg, #7425C9, #B886EE, #7425C9);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
`;

const LoadingText = styled.h1`
  color: white;
  font-size: 3em;
`;

function LoadingScreen() {
  return (
    <LoadingContainer>
      <LoadingText>Trader Workspace</LoadingText>
    </LoadingContainer>
  );
}

export default LoadingScreen;