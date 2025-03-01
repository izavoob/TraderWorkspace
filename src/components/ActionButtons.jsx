import React from 'react';
import styled from 'styled-components';
import EditIcon from '../../assets/icons/edit-icon.svg';
import DeleteIcon from '../../assets/icons/delete-icon.svg';

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;

  .table-row:hover & {
    opacity: 1;
  }
`;

const IconButton = styled.button` /* Виправив помилку, додавши визначення IconButton */
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    filter: brightness(1.5);
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

function ActionButtons({ tradeId, onEdit, onDelete }) {
  return (
    <ButtonsContainer>
      <IconButton onClick={() => onEdit(tradeId)}>
        <img src={EditIcon} alt="Edit" />
      </IconButton>
      <IconButton onClick={() => onDelete(tradeId)}>
        <img src={DeleteIcon} alt="Delete" />
      </IconButton>
    </ButtonsContainer>
  );
}

export default ActionButtons;