import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const GalleryItemStyled = styled(Link)`
  width: 22%; /* 4 в ряд із відступами */
  height: 100px;
  background-color: #2e2e2e;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #fff;
  border: 2px solid #5e2ca5;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #3e3e3e;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

function GalleryItem({ title, path }) {
  return <GalleryItemStyled to={path}>{title}</GalleryItemStyled>;
}

export default GalleryItem;