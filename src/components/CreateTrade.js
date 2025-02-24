import React from 'react';
import styled from 'styled-components';

const CreateTradeContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  min-height: 100vh; /* Розтягуємо фон на всю висоту */
  background-color: #1a1a1a; /* Темний фон */
  padding: 20px;
  border-radius: 5px;
  color: #fff;
`;

const CreateTradeTitle = styled.h2`
  color: #5e2ca5;
  margin-bottom: 20px;
`;

function CreateTrade() {
  return (
    <CreateTradeContainer>
      <CreateTradeTitle>Create Trade (Coming soon)</CreateTradeTitle>
      <p>This is a placeholder for the create trade page.</p>
    </CreateTradeContainer>
  );
}

export default CreateTrade;