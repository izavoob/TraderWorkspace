import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  color: white;
`;

const Title = styled.h2`
  color: #B886EE;
  margin-bottom: 20px;
`;

function QPA() {
  return (
    <Container>
      <Title>Quarterly Performance Analysis</Title>
      {/* Тут буде ваш код для аналізу квартальної продуктивності */}
    </Container>
  );
}

export default QPA;