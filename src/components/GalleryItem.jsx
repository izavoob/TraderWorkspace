import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const GalleryItemStyled = styled(Link)`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border-radius: 20px; /* Збільшено заокруглення для більших кнопок */
  height: 250px; /* Збільшено висоту для 1920x1080 */
  width: 400px; /* Збільшено ширину для 1920x1080, щоб займати більше простору */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Центрування по висоті */
  align-items: center; /* Центрування по ширині */
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Збільшено тінь для більших кнопок */

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ItemTitle = styled.h3`
  margin: 0;
  font-size: 2em; /* Збільшено розмір тексту для більших кнопок */
`;

const ItemDescription = styled.p`
  margin: 15px 0 0; /* Збільшено відступ для більших кнопок */
  font-size: 1.1em; /* Збільшено розмір опису */
  color: #e0e0e0;
`;

function GalleryItem({ title, path, description }) {
  return (
    <GalleryItemStyled to={path}>
      <ItemTitle>{title}</ItemTitle>
      <ItemDescription>{description}</ItemDescription>
    </GalleryItemStyled>
  );
}

export default GalleryItem;