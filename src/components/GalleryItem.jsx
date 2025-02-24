import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const GalleryItemStyled = styled(Link)`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border-radius: 15px;
  height: 150px;
  width: 100%; /* Адаптивна ширина для сітки */
  max-width: 250px; /* Обмеження максимальної ширини для великих екранів */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Центрування по висоті */
  align-items: center; /* Центрування по ширині */
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

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
  font-size: 1.5em;
`;

const ItemDescription = styled.p`
  margin: 10px 0 0;
  font-size: 0.9em;
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