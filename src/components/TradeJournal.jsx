import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from 'react-table';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import EditIcon from '../assets/icons/edit-icon.svg';
import DeleteIcon from '../assets/icons/delete-icon.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/locale';

registerLocale('en-gb', enGB);

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-color: #1a1a1a;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #7425C9;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #5e2ca5;
  }
`;

const DatePickerStyles = createGlobalStyle`
  .react-datepicker {
    background-color: #2e2e2e;
    border: 1px solid #5e2ca5;
    font-family: Roboto, sans-serif;
  }

  .react-datepicker__header {
    background: #1a1a1a;
    border-bottom: 1px solid #5e2ca5;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name,
  .react-datepicker__day {
    color: #fff;
  }

  .react-datepicker__day:hover {
    background: linear-gradient(45deg, #7425C9, #B886EE);
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-range {
    background: linear-gradient(45deg, #7425C9, #B886EE);
    color: #fff;
  }

  .react-datepicker__navigation {
    top: 8px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #B886EE;
  }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shineEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;


const slideAnim = keyframes`
  0% { opacity: 0; transform: translateX(-15px) scale(0.95); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
`;

const TradeJournalContainer = styled.div`
  max-width: 1820px;
  margin: 0 auto;
  background-color: #1a1a1a;
  padding: 20px;
  position: relative;
  min-height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
`;

const Header = styled.header`
  background: linear-gradient(45deg, #7425C9, #B886EE, #7425C9);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  padding: 20px 0;
  border-radius: 8px;
  color: #fff;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
  min-height: 6.67vh;
  max-height: 128px;
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
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
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
  margin: 0;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

// Додаємо новий компонент для підзаголовка
const Subtitle = styled.p`
  color: #ff8c00;
  margin-top: 10px;
  font-size: 1.2em;
`;

const JournalContent = styled.div`
  width: 100%;
  height: calc(100vh - 148px);
  display: flex;
  flex-direction: column;
  gap: 5px;
  
`;

const JournalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  flex-direction: row;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ActionButton = styled.button`
  background-color: ${props => props.primary ? 'transparent' : '#5e2ca5'};
  background: ${props => props.primary ? 
    'linear-gradient(90deg, rgb(232, 137, 0), rgb(184, 134, 238), rgb(255, 140, 0)) 0% 0% / 200% 200%' : 
    '#5e2ca5'};
  animation: ${props => props.primary ? gradientAnimation : 'none'} 3s ease infinite;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.3s ease;
  position: relative;
  isolation: isolate;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    background-size: 200% 100%;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: ${props => props.primary ? 'transparent' : '#4a1a8d'};
    transform: scale(1.05);
    
    &::before {
      opacity: 1;
      animation: ${shineEffect} 1.5s linear infinite;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const FilterDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: #2e2e2e;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  border-radius: 10px;
  padding: 15px;
  z-index: 1000;
  transform-origin: top right;
  animation: dropDown 0.3s ease;

  @keyframes dropDown {
    from {
      transform: scaleY(0);
      opacity: 0;
    }
    to {
      transform: scaleY(1);
      opacity: 1;
    }
  }
`;

const SortDropdown = styled(FilterDropdown)`
  width: 200px;
`;

const RangeDropdown = styled(FilterDropdown)`
  
`;

const FilterGroup = styled.div`
  margin-bottom: 15px;
`;


const SortGroup = styled(FilterGroup)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  display: block;
  color: #fff;
  font-size: 14px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 8px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;

  option {
    background: #3e3e3e;
    color: #fff;
    padding: 8px;
  }
`;

const FilterButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
`;

const FilterButton = styled(ActionButton)`
 
`;
const SortOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  color: #fff;

  &:hover {
    background-color: #3e3e3e;
  }

  ${props => props.selected && `
    background-color: #5e2ca5;
  `}
`;

const RadioButton = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #B886EE;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => props.selected && `
    &::after {
      content: '';
      width: 8px;
      height: 8px;
      background: #B886EE;
      border-radius: 50%;
    }
  `}
`;

const StyledDatePicker = styled(DatePicker)`
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  color: #fff;
  padding: 11px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 11px;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const TableContainer = styled.div`
  position: relative;
  bottom: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  overflow-x: hidden;
  
  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background: linear-gradient(45deg, #7425C9, #B886EE, #7425C9);
    background-size: 200% 200%;
    animation: ${gradientAnimation} 5s ease infinite;
  }

  tbody {
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #7425C9;
    border-radius: 2px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #5e2ca5;
  }
`;

const TradeTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 1px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const TableHeader = styled.th`
  padding: 12px;
  font-size: 14px;
  text-align: center
  letter-spacing: 0.5px;
  font-weight: 500;
  text-transform: uppercase;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 2;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 1px;
    background: #5e2ca5;
  }
`;

const TableCell = styled.td`
  padding: 6px;
  text-align: center;
  color: ${props => {
    if (props.column === 'profitLoss' || props.column === 'gainedPoints') {
      const value = props.value ? parseFloat(props.value.toString().replace(/[^-\d.]/g, '')) : 0;
      return value > 0 ? '#00d1b2' : value < 0 ? '#ff4560' : '#fff';
    }
    if (props.column === 'result') {
      if (props.value === 'Win') return '#00D1B2';
      if (props.value === 'Loss') return '#ff5252';
      if (props.value === 'Breakeven') return '#ff9300';
      if (props.value === 'Missed') return '#9370db';
    }
    return '#fff';
  }};
  position: relative;

  // Додаємо стилі для першої колонки
  &:first-child {
    max-width: 105px !important; // Задаємо фіксовану ширину
    overflow: hidden; // Обрізаємо вміст, якщо він не вміщається
  }

  


  
  
`;

const TableRow = styled.tr`
  position: relative;                    // Для позиціонування дочірніх елементів
  transition: background-color 0.3s ease, transform 0.2s ease;  // Плавні переходи
  background-color: rgb(37, 37, 37);     // Темно-сірий фон
  overflow-x: hidden;                    // Приховує горизонтальний overflow
  cursor: pointer;                       // Курсор-вказівник для кращого UX
  
  &:hover {                              // Стилі при наведенні
    background-color:rgba(116, 37, 201, 0.4);   // Фіолетовий напівпрозорий фон
    transform: translateY(-1px);            // Легке підняття
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);  // Тінь
  }
  
  &:nth-child(even) {                    // Парні рядки
    background-color: rgb(62, 62, 62);
    overflow-x: hidden;

     &:hover {                              // Стилі при наведенні
    background-color:rgba(116, 37, 201, 0.4);   // Фіолетовий напівпрозорий фон
    transform: translateY(-1px);            // Легке підняття
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);  // Тінь
  }

    
  }
  &:nth-child(odd) {                     // Непарні рядки
    background-color: rgb(37, 37, 37); 
    overflow-x: hidden;

   &:hover {                              // Стилі при наведенні
    background-color:rgba(116, 37, 201, 0.4);   // Фіолетовий напівпрозорий фон
    transform: translateY(-1px);            // Легке підняття
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);  // Тінь
  }

  }

  ${props => props.selected && css`      // Стилі для вибраного стану
    && {                                // Підвищена специфічність
      background-color: #7425c966;      // Фіолетовий фон
      overflow-x: hidden;               // Приховує горизонтальний overflow
    }
  `}

  ${props => props.isSubtrade && css`    // Стилі для субрядків
    & > td {                            // Усі клітинки
      
      background-color: rgba(80, 100, 160, 0.4);          
    }

    & > td:first-child::before { 
      overflow: hidden;           
      content: '↳';                    // Стрілка
      position: absolute;              // Абсолютне позиціонування
      left: 12px;                       // Відступ зліва
      color: rgb(18, 122, 227);                
    }
  `}

  &:hover {                              // Стилі при наведенні для чекбокса
    .checkbox-container {
      opacity: ${props => props.selected ? 1 : 0.8};  // Прозорість залежно від стану
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;

  // Стилі для субтрейдів застосовуємо напряму до div, якщо isSubtrade === true
  ${props => props.isSubtrade && css`
    padding-left: 20px; // Відступ зліва для всього контейнера
  `}
`;



const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #2e2e2e;
  padding: 40px;
  border-radius: 20px;
  border: 2px solid #5e2ca5;
  color: #fff;
  z-index: 1001;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  min-width: 400px;
  min-height: 200px;
`;

const PopupButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: #fff;
  border: none;
  padding: 16px 32px;
  margin: 10px;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;


const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  min-width: 16px;
  cursor: pointer;
  appearance: none;
  border: 2px solid #B886EE;
  border-radius: 4px;
  background-color: transparent;
  position: relative;

  &:checked {
    background-color: #7425C9;
    &:after {
      content: '';
      position: absolute;
      left: 4px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  &:hover {
    border-color: #B886EE;
  }
`;

const DeleteSelectedButton = styled(ActionButton)`
  background: #ff4757;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  padding: 6px 20px;
`;

const AddSubtradeButton = styled(ActionButton)`
  background: #5C9DF5;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  padding: 6px 20px;

`;

const ArrowContainer = styled.div`
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -20px;
    width: 20px;
    height: 40px;
    border: 2px solid #5C9DF5;
    border-right: 0;
    border-radius: 20px 0 0 20px;
  }
`;

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 10px;
  gap: 12px;
  color: #fff;

  > div {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  > div:last-child {
    margin-left: auto;
    display: flex;
    gap: 12px;
  }
`;

// Додаємо новий контейнер для фільтрів
const ActiveFiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  ::-webkit-scrollbar {
    height: 3px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #7425C9;
    border-radius: 2px;
  }
`;

// Додаємо компонент для відображення активного фільтра
const ActiveFilter = styled.div`
  display: flex;
  align-items: center;
  background: rgba(94, 44, 165, 0.4);
  border-radius: 20px;
  padding: 0px 10px;
  font-size: 12px;
  white-space: nowrap;
  border: 1px solid rgba(184, 134, 238, 0.6);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(116, 37, 201, 0.5);
  }
`;

const ActiveFilterLabel = styled.span`
  color: #B886EE;
  font-weight: 500;
  margin-right: 5px;
`;

const ConfirmationPopup = styled(Popup)`
  text-align: center;

  p {
    margin-bottom: 20px;
  }

  span {
    color: #ff4757;
    font-weight: bold;
  }
`;

const TradeCalendarContainer = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 20px;
  margin-bottom: 15px;
  width: 100%;
`;

const CalendarDay = styled.div`
  flex: 1;
  background-color: #252525;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  height: 125px;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  opacity: 0.6;
  transition: opacity 0.3s ease;
  box-sizing: border-box;

  ${props => props.hasData && `
    opacity: 1;
  `}

  ${props => props.isToday && `
    &::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 10px;
      background: linear-gradient(45deg, #7425c9, #b886ee);
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  `}

  ${props => {
    if (!props.hasData || !props.dayResults) return '';
    
    const { totalProfitLoss, results } = props.dayResults;
    
    if (totalProfitLoss > 0) {
      return `
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0, 230, 118, 0.3), transparent);
          border-radius: 8px;
        }
      `;
    } else if (totalProfitLoss < 0) {
      return `
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(255, 82, 82, 0.3), transparent);
          border-radius: 8px;
        }
      `;
    } else if (results && results.includes('Breakeven')) {
      return `
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(255, 147, 0, 0.3), transparent);
          border-radius: 8px;
        }
      `;
    } else if (results && results.includes('Missed')) {
      return `
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(147, 112, 219, 0.3), transparent);
          border-radius: 8px;
        }
      `;
    }
    return '';
  }}
`;

const CalendarDayHeader = styled.div`
  font-size: 1.2em;
  color: rgb(230, 243, 255);
  font-weight: bold;
  margin-bottom: 8px;
`;

const CalendarDayMetrics = styled.div`
  font-size: 1em;
  position: relative;
  z-index: 1;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PairContainer = styled.div`
  height: 20px;
  position: relative;
  overflow: hidden;
  width: 100%;
`;

const PairText = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  animation: ${slideAnim} 0.5s ease forwards;
  white-space: nowrap;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(45deg, #b886ee, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MetricsValue = styled.span`
  ${props => {
    const numericValue = props.type === 'profit' || props.type === 'loss' 
      ? parseFloat(props.value) || 0 
      : 0;

    if (numericValue === 0) return 'color: #fff;';
    
    if (numericValue > 0) return 'color: #00e676;';
    if (numericValue < 0) return 'color: #ff5252;';
    
    if (props.type === 'breakeven') return 'color: #ff9300;';
    if (props.type === 'missed') return 'color: #9370db;';
    return 'color: #fff;';
  }}
  font-weight: bold;
`;

const FilterValue = styled.span`
  color: ${props => {
    // For the 'result' filter specifically
    if (props.children === 'Win') return '#00D1B2';
    if (props.children === 'Loss') return '#ff5252';
    if (props.children === 'Breakeven') return '#ff9300';
    if (props.children === 'Missed') return '#9370db';
    
    // For the direction filter
    if (props.children === 'Long') return '#00D1B2';
    if (props.children === 'Short') return '#ff5252';
    
    // Default color for other filter values
    return '#fff';
  }};
  font-weight: 500;
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  color: #ff4757;
  cursor: pointer;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  min-height: 28px;
  position: relative;
  z-index: 20;
  
  &:hover {
    color: #ff7b86;
    transform: scale(1.2);
  }
  
  &:focus {
    outline: none;
    color: #ff7b86;
    transform: scale(1.2);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    z-index: -1;
  }
`;

// Додаю стилізований компонент для кнопки очищення фільтрів
const ClearAllButton = styled.button`
  background-color: #5e2ca5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 7px 16px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 30;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 3px 8px;

  &:hover {
    background-color: #7425C9;
    transform: translateY(-2px);
    box-shadow: rgba(0, 0, 0, 0.4) 0px 5px 12px;
  }
  
  &:focus {
    outline: none;
    background-color: #7425C9;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    z-index: -1;
  }
`;

const FilterCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 8px;
  cursor: pointer;
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #B886EE;
  border-radius: 4px;
  background-color: transparent;
  position: relative;

  &:checked {
    background-color: #7425C9;
    &:after {
      content: '';
      position: absolute;
      left: 4px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  &:hover {
    border-color: #B886EE;
  }
`;

const FilterOption = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3e3e3e;
  }

  label {
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
  }
`;

const MultiSelectDropdown = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const DropdownToggle = styled.div`
  background: #3e3e3e;
  border-radius: 8px;
  padding: 8px 12px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  &:hover {
    background: #4a1a8d;
  }

  &:after {
    content: '▼';
    font-size: 10px;
    margin-left: 8px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  margin-top: 5px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
  display: ${props => props.isOpen ? 'block' : 'none'};
  
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #7425C9;
    border-radius: 2px;
  }
`;

const SelectedItems = styled.div`
  font-size: 13px;
  color: #B886EE;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
  text-align: center;
`;

function TradeJournal() {
  const [trades, setTrades] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [dateRange, setDateRange] = useState(() => {
    // Восстанавливаем диапазон дат из localStorage
    try {
      const savedRange = localStorage.getItem('tradeJournal_dateRange');
      if (savedRange) {
        const parsed = JSON.parse(savedRange);
        return [
          parsed[0] ? new Date(parsed[0]) : null,
          parsed[1] ? new Date(parsed[1]) : null
        ];
      }
    } catch (error) {
      console.error('Error restoring date range from localStorage:', error);
    }
    return [null, null];
  });
  const [startDate, endDate] = dateRange;
  const [filterCriteria, setFilterCriteria] = useState(() => {
    // Восстанавливаем критерии фильтрации из localStorage
    try {
      const savedFilters = localStorage.getItem('tradeJournal_filters');
      if (savedFilters) {
        return JSON.parse(savedFilters);
      }
    } catch (error) {
      console.error('Error restoring filters from localStorage:', error);
    }
    return {
      pair: [],
      session: [],
      direction: [],
      result: []
    };
  });
  const [deletePopup, setDeletePopup] = useState(null);
  const [sortConfig, setSortConfig] = useState(() => {
    // Восстанавливаем настройки сортировки из localStorage
    try {
      const savedSort = localStorage.getItem('tradeJournal_sortConfig');
      if (savedSort) {
        return JSON.parse(savedSort);
      }
    } catch (error) {
      console.error('Error restoring sort config from localStorage:', error);
    }
    return {
      key: 'date',
      direction: 'desc'
    };
  });
  const [selectedTrades, setSelectedTrades] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tradeRelations, setTradeRelations] = useState({});
  const [expandedTrades, setExpandedTrades] = useState(() => {
    // Восстанавливаем состояние развернутых трейдов из localStorage
    try {
      const savedExpanded = localStorage.getItem('tradeJournal_expandedTrades');
      if (savedExpanded) {
        return JSON.parse(savedExpanded);
      }
    } catch (error) {
      console.error('Error restoring expanded trades from localStorage:', error);
    }
    return [];
  });
  const [allSubtradesExpanded, setAllSubtradesExpanded] = useState(() => {
    // Восстанавливаем состояние кнопки показа/скрытия всех субтрейдов
    try {
      const savedState = localStorage.getItem('tradeJournal_allSubtradesExpanded');
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error restoring allSubtradesExpanded from localStorage:', error);
    }
    return false;
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const hasRendered = useRef(false);
  const containerRef = useRef(null);
  const filterButtonRef = useRef(null);
  const rangeButtonRef = useRef(null);
  const sortButtonRef = useRef(null);
  const [openDropdowns, setOpenDropdowns] = useState({
    pair: false,
    session: false,
    direction: false,
    result: false
  });

  // Сохраняем настройки фильтров, сортировки и состояние развернутых трейдов
  useEffect(() => {
    localStorage.setItem('tradeJournal_filters', JSON.stringify(filterCriteria));
  }, [filterCriteria]);

  useEffect(() => {
    // Сохраняем только даты без времени
    const dateRangeToSave = dateRange.map(date => 
      date ? date.toISOString().split('T')[0] : null
    );
    localStorage.setItem('tradeJournal_dateRange', JSON.stringify(dateRangeToSave));
  }, [dateRange]);

  useEffect(() => {
    localStorage.setItem('tradeJournal_sortConfig', JSON.stringify(sortConfig));
  }, [sortConfig]);

  useEffect(() => {
    localStorage.setItem('tradeJournal_expandedTrades', JSON.stringify(expandedTrades));
  }, [expandedTrades]);

  useEffect(() => {
    localStorage.setItem('tradeJournal_allSubtradesExpanded', JSON.stringify(allSubtradesExpanded));
  }, [allSubtradesExpanded]);

  // Виношу функцію loadTrades за межі useEffect
  const loadTrades = async () => {
    console.log("ВИКОНУЄТЬСЯ: loadTrades()");
    try {
      console.log("Спроба отримати трейди з API");
      const loadedTrades = await window.electronAPI.getTrades();
      console.log(`Отримано ${loadedTrades?.length || 0} трейдів з API`);
      setTrades(loadedTrades || []);
      
      // Створюємо мапу зв'язків між батьківськими трейдами та субтрейдами
      const relations = {};
      loadedTrades?.forEach(trade => {
        if (trade.parentTradeId) {
          if (!relations[trade.parentTradeId]) {
            relations[trade.parentTradeId] = [];
          }
          relations[trade.parentTradeId].push(trade.id);
        }
      });
      
      setTradeRelations(relations);
      console.log("Трейди успішно завантажені та відносини встановлені");
    } catch (error) {
      console.error('Error loading trades:', error);
      setTrades([]);
    }
  };

  useEffect(() => {
    console.log("Початкове завантаження трейдів при монтуванні компонента");
    loadTrades();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterButtonRef.current && 
          !filterButtonRef.current.contains(event.target) && 
          !event.target.closest('.filter-dropdown')) {
        setShowFilterDropdown(false);
      }
      if (rangeButtonRef.current && 
          !rangeButtonRef.current.contains(event.target) && 
          !event.target.closest('.range-dropdown')) {
        setShowRangeDropdown(false);
      }
      if (sortButtonRef.current && 
          !sortButtonRef.current.contains(event.target) && 
          !event.target.closest('.sort-dropdown')) {
        setShowSortDropdown(false);
      }
      if (!event.target.closest('.multi-select-dropdown')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const newConfig = {
        key,
        direction: prevConfig.key === key && prevConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc'
      };
      
      // Сохраняем в localStorage
      localStorage.setItem('tradeJournal_sortConfig', JSON.stringify(newConfig));
      
      return newConfig;
    });
  };

  const sortTrades = React.useCallback((trades) => {
    if (!trades || trades.length === 0) return [];
    
    // Спочатку групуємо трейди за parentTradeId
    const tradeGroups = trades.reduce((groups, trade) => {
      if (!trade.parentTradeId) {
        // Якщо це основний трейд, створюємо нову групу
        if (!groups[trade.id]) {
          groups[trade.id] = {
            main: trade,
            subtrades: []
          };
        } else {
          groups[trade.id].main = trade;
        }
      } else {
        // Якщо це підтрейд, додаємо його до групи батьківського трейду
        if (!groups[trade.parentTradeId]) {
          groups[trade.parentTradeId] = {
            main: null,
            subtrades: [trade]
          };
        } else {
          groups[trade.parentTradeId].subtrades.push(trade);
        }
      }
      return groups;
    }, {});

    // Сортуємо основні трейди
    const mainTrades = Object.values(tradeGroups)
      .filter(group => group.main)
      .map(group => group.main)
      .sort((a, b) => {
        if (sortConfig.key === 'date') {
          const dateA = new Date(a.date || 0).getTime();
          const dateB = new Date(b.date || 0).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        if (sortConfig.key === 'no') {
          const noA = parseInt(a.no) || 0;
          const noB = parseInt(b.no) || 0;
          return sortConfig.direction === 'asc' ? noA - noB : noB - noA;
        }
        
        if (sortConfig.key === 'profitLoss') {
          const profitA = parseFloat(a.profitLoss?.replace('%', '') || 0);
          const profitB = parseFloat(b.profitLoss?.replace('%', '') || 0);
          return sortConfig.direction === 'asc' ? profitA - profitB : profitB - profitA;
        }
        
        if (sortConfig.key === 'gainedPoints') {
          const gainedA = parseFloat(a.gainedPoints?.replace(/[^-\d.]/g, '') || 0);
          const gainedB = parseFloat(b.gainedPoints?.replace(/[^-\d.]/g, '') || 0);
          return sortConfig.direction === 'asc' ? gainedA - gainedB : gainedB - gainedA;
        }
        
        if (sortConfig.key === 'result') {
          const resultOrder = { 'Win': 0, 'Breakeven': 1, 'Missed': 2, 'Loss': 3 };
          const resultA = resultOrder[a.result] !== undefined ? resultOrder[a.result] : 999;
          const resultB = resultOrder[b.result] !== undefined ? resultOrder[b.result] : 999;
          return sortConfig.direction === 'asc' ? resultA - resultB : resultB - resultA;
        }
        
        return 0;
      });

    // Формуємо фінальний масив, додаючи підтрейди після їх батьківських трейдів
    return mainTrades.reduce((result, mainTrade) => {
      result.push(mainTrade);
      if (tradeGroups[mainTrade.id].subtrades.length > 0) {
        result.push(...tradeGroups[mainTrade.id].subtrades);
      }
      return result;
    }, []);
  }, [sortConfig]);

  const filteredAndSortedTrades = React.useMemo(() => {
    console.log("Перераховуємо filteredAndSortedTrades");
    console.log("Поточні фільтри:", JSON.stringify(filterCriteria));
    console.log("Діапазон дат:", startDate, endDate);
    console.log("Конфігурація сортування:", JSON.stringify(sortConfig));
    
    // Спочатку фільтруємо
    const filtered = trades.filter((trade) => {
      if (!trade) return false;
      
      const tradeDate = trade.date ? new Date(trade.date) : null;
      const inDateRange = startDate && endDate && tradeDate ? 
        (tradeDate >= startDate && tradeDate <= new Date(endDate.setHours(23, 59, 59, 999))) : true;
  
      const matchesPair = filterCriteria.pair.length === 0 || filterCriteria.pair.includes(trade.pair);
      const matchesSession = filterCriteria.session.length === 0 || filterCriteria.session.includes(trade.session);
      const matchesDirection = filterCriteria.direction.length === 0 || filterCriteria.direction.includes(trade.direction);
      const matchesResult = filterCriteria.result.length === 0 || filterCriteria.result.includes(trade.result);
  
      return inDateRange && matchesPair && matchesSession && matchesDirection && matchesResult;
    });

    console.log(`Відфільтровано ${filtered.length} з ${trades.length} трейдів`);
    
    const result = sortTrades(filtered);
    console.log(`Після сортування: ${result.length} трейдів`);
    
    return result;
  }, [trades, filterCriteria, startDate, endDate, sortTrades]);

  const handleSelectTrade = (tradeId) => {
    setSelectedTrades(prev => {
      if (prev.includes(tradeId)) {
        return prev.filter(id => id !== tradeId);
      } else {
        return [...prev, tradeId];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Вибираємо тільки ті трейди, які видимі в інтерфейсі
      setSelectedTrades(displayedTrades.map(trade => trade.id));
    } else {
      setSelectedTrades([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Зберігаємо всі ID субтрейдів для батьківських трейдів, які будуть видалені
      const subtradeIdsToDelete = [];
      const parentIdsToUpdate = new Set();
      
      // Для кожного вибраного трейду
      selectedTrades.forEach(id => {
        // Якщо це батьківський трейд і він має субтрейди
        if (tradeRelations[id]?.length > 0) {
          // Додаємо всі його субтрейди до списку на видалення
          subtradeIdsToDelete.push(...tradeRelations[id]);
        } 
        // Якщо це субтрейд
        else {
          // Знаходимо його батька
          const parentId = trades.find(t => t.id === id)?.parentTradeId;
          if (parentId) {
            parentIdsToUpdate.add(parentId);
          }
        }
      });
      
      // Видаляємо всі вибрані трейди та їх субтрейди
      const idsToDelete = [...selectedTrades, ...subtradeIdsToDelete];
      await Promise.all(idsToDelete.map(id => window.electronAPI.deleteTrade(id)));
      
      // Оновлюємо стан зв'язків для батьківських трейдів
      const newRelations = { ...tradeRelations };
      
      // Видаляємо всі зв'язки з видаленими батьківськими трейдами
      selectedTrades.forEach(id => {
        if (newRelations[id]) {
          delete newRelations[id];
        }
      });
      
      // Оновлюємо зв'язки для батьківських трейдів, у яких видалені субтрейди
      parentIdsToUpdate.forEach(parentId => {
        if (newRelations[parentId]) {
          newRelations[parentId] = newRelations[parentId].filter(id => !selectedTrades.includes(id));
        }
      });
      
      setTradeRelations(newRelations);
      
      // Оновлюємо список трейдів
      setTrades(prevTrades => 
        prevTrades.filter(trade => !idsToDelete.includes(trade.id))
      );
      
      setSelectedTrades([]);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting trades:', error);
    }
  };

  const handleCreateSubtrade = async () => {
    if (selectedTrades.length !== 1) {
      return; // Можна створити підтрейд тільки з одного вибраного трейду
    }

    const selectedTrade = trades.find(trade => trade.id === selectedTrades[0]);
    if (!selectedTrade) return;
    
    // Перевіряємо чи вибраний трейд не є вже субтрейдом
    if (selectedTrade.parentTradeId) {
      alert("Неможливо створити субтрейд з іншого субтрейду");
      return;
    }

    try {
      // Створюємо копію трейду без певних полів
      const subtrade = {
        ...selectedTrade,
        id: Date.now(), // Генеруємо новий ID
        risk: '', // Очищаємо ризик
        profitLoss: '', // Очищаємо профіт
        gainedPoints: '$0.00', // Очищаємо прибуток в доларах
        account: '', // Очищаємо account
        parentTradeId: selectedTrade.id, // Додаємо посилання на батьківський трейд
        // Копіюємо тільки Daily та 4h таймфрейми
        topDownAnalysis: selectedTrade.topDownAnalysis.map((item, index) => {
          if (index <= 1) { // Daily та 4h
            return {
              ...item,
              title: item.title,
              screenshot: item.screenshot,
              text: item.text
            };
          } else {
            return {
              title: item.title,
              screenshot: '',
              text: ''
            };
          }
        })
      };

      // Зберігаємо новий трейд
      await window.electronAPI.saveTrade(subtrade);
      
      // Оновлюємо стан зв'язків
      const newRelations = {
        ...tradeRelations,
        [selectedTrade.id]: [...(tradeRelations[selectedTrade.id] || []), subtrade.id]
      };
      setTradeRelations(newRelations);
      
      // Автоматично розгортаємо батьківський трейд
      if (!expandedTrades.includes(selectedTrade.id)) {
        setExpandedTrades([...expandedTrades, selectedTrade.id]);
      }

      // Оновлюємо список трейдів
      const updatedTrades = await window.electronAPI.getTrades();
      setTrades(updatedTrades || []);
      
      // Очищаємо вибір
      setSelectedTrades([]);
    } catch (error) {
      console.error('Error creating subtrade:', error);
    }
  };

  const columns = React.useMemo(
    () => [
      { 
        Header: 'Actions',
        accessor: 'actions',
        width: 40,
        Cell: ({ row }) => {
          const hasSubtrades = tradeRelations[row.original.id]?.length > 0;
          const isExpanded = expandedTrades.includes(row.original.id);
          const isSubtrade = !!row.original.parentTradeId; // Перевіряємо, чи це субтрейд
          
          return (
            <ButtonsContainer isSubtrade={isSubtrade}>
              <Checkbox
                type="checkbox"
                checked={selectedTrades.includes(row.original.id)}
                onChange={() => handleSelectTrade(row.original.id)}
              />
              <ActionButton onClick={() => handleEdit(row.original.id)} style={{ padding: '6px', minWidth: 'auto' }}>
                <img src={EditIcon} alt="Edit" style={{ width: '18px', height: '18px' }} />
              </ActionButton>
              <ActionButton 
                onClick={() => handleDelete(row.original.id)} 
                style={{ padding: '6px', minWidth: 'auto', background: '#ff4757' }}
              >
                <img src={DeleteIcon} alt="Delete" style={{ width: '18px', height: '18px' }} />
              </ActionButton>
              {hasSubtrades && !row.original.parentTradeId && (
                <ActionButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(row.original.id);
                  }}
                  style={{  
                    padding: '0px',
                    minWidth: 'auto', 
                    background: isExpanded ? 'rgb(52, 152, 219, 0)' : 'rgb(52, 152, 219, 0)'
                  }}
                >
                  {isExpanded ? (
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>▲</span>
                  ) : (
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>▼</span>
                  )}
                </ActionButton>
              )}
            </ButtonsContainer>
          );
        }
      },
      { Header: 'No.', accessor: 'no', width: 60 },
      { Header: 'Date', accessor: 'date', width: 120 },
      { Header: 'Pair', accessor: 'pair', width: 120 },
      { Header: 'Session', accessor: 'session', width: 100 },
      { Header: 'Direction', accessor: 'direction', width: 100 },
      { Header: 'Result', accessor: 'result', width: 100 },
      { Header: 'Category', accessor: 'category', width: 80 },
      { 
        Header: 'Profit %', 
        accessor: 'profitLoss',
        Cell: ({ value }) => `${value || 0}%`,
        width: 80 
      },
      { 
        Header: 'Profit $', 
        accessor: 'gainedPoints',
        Cell: ({ value }) => value || '$0.00',
        width: 80 
      },
    ],
    [selectedTrades, tradeRelations, expandedTrades, toggleExpand]
  );

  const displayedTrades = React.useMemo(() => {
    return filteredAndSortedTrades.filter(trade => {
      if (!trade.parentTradeId) return true;
      
      return expandedTrades.includes(trade.parentTradeId);
    });
  }, [filteredAndSortedTrades, expandedTrades]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ 
    columns, 
    data: displayedTrades,
    initialState: {
      sortBy: [{ id: 'no', desc: true }]
    }
  });

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    
    setFilterCriteria(prev => {
      // Если чекбокс отмечен, добавляем значение в массив
      // Если снят, убираем значение из массива
      const updatedValues = checked 
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value);
      
      return {
        ...prev,
        [name]: updatedValues
      };
    });
  };

  const handleFilterClear = () => {
    // Очищаем все фильтры и сохраняем в localStorage
    setFilterCriteria({
      pair: [],
      session: [],
      direction: [],
      result: []
    });
    // Очищаем localStorage для фильтров
    localStorage.removeItem('tradeJournal_filters');
    
    // Применяем фильтры немедленно
    setTimeout(() => applyFilters(), 0);
  };

  const handleFilterApply = () => {
    setShowFilterDropdown(false);
  };

  const handleRangeApply = () => {
    setShowRangeDropdown(false);
  };

  const clearDateRange = () => {
    console.log("ВИКОНУЄТЬСЯ: clearDateRange()");
    console.log("Діапазон дат ДО скидання:", startDate, endDate);
    
    setDateRange([null, null]);
    localStorage.removeItem('tradeJournal_dateRange');
    
    console.log("Діапазон дат ПІСЛЯ скидання: null, null");
    
    // Принудительно обновляем состояние и перезагружаем данные
    console.log("Викликаю loadTrades() після скидання діапазону дат");
    setTimeout(() => {
      console.log("setTimeout спрацював для clearDateRange");
      loadTrades();
    }, 0);
  };

  const handleAddTrade = () => {
    navigate('/create-trade');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (tradeId) => {
    navigate(`/trade/${tradeId}`);
  };

  const handleDelete = async (tradeId) => {
    try {
      // Перевіряємо чи це основний трейд з субтрейдами
      if (tradeRelations[tradeId]?.length > 0) {
        // Якщо це основний трейд з субтрейдами, видаляємо всі його субтрейди
        await Promise.all(tradeRelations[tradeId].map(subtrade => 
          window.electronAPI.deleteTrade(subtrade)
        ));
        
        // Видаляємо зв'язки з цим трейдом
        const newRelations = { ...tradeRelations };
        delete newRelations[tradeId];
        setTradeRelations(newRelations);
      } 
      // Якщо це субтрейд, то оновлюємо список субтрейдів у батьківського трейду
      else {
        const parentId = trades.find(t => t.id === tradeId)?.parentTradeId;
        if (parentId && tradeRelations[parentId]) {
          const newRelations = { ...tradeRelations };
          newRelations[parentId] = newRelations[parentId].filter(id => id !== tradeId);
          setTradeRelations(newRelations);
        }
      }
      
      // Видаляємо сам трейд
      await window.electronAPI.deleteTrade(tradeId);
      
      // Оновлюємо список трейдів
      setTrades(prevTrades => prevTrades.filter(trade => 
        trade.id !== tradeId && trade.parentTradeId !== tradeId
      ));
      
      setDeletePopup(null);
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  const toggleExpand = (tradeId) => {
    setExpandedTrades(prev => 
      prev.includes(tradeId) 
        ? prev.filter(id => id !== tradeId) 
        : [...prev, tradeId]
    );
  };

  const toggleAllSubtrades = () => {
    if (allSubtradesExpanded) {
      // Згортаємо всі субтрейди
      setExpandedTrades([]);
    } else {
      // Розгортаємо всі трейди, у яких є субтрейди
      const parentIds = trades
        .filter(trade => tradeRelations[trade.id] && tradeRelations[trade.id].length > 0)
        .map(trade => trade.id);
      setExpandedTrades(parentIds);
    }
    // Інвертуємо стан кнопки
    setAllSubtradesExpanded(!allSubtradesExpanded);
  };

  const resetSortConfig = () => {
    console.log("ВИКОНУЄТЬСЯ: resetSortConfig()");
    console.log("Конфігурація сортування ДО скидання:", JSON.stringify(sortConfig));
    
    const defaultConfig = { key: 'date', direction: 'desc' };
    setSortConfig(defaultConfig);
    localStorage.setItem('tradeJournal_sortConfig', JSON.stringify(defaultConfig));
    setShowSortDropdown(false);
    
    console.log("Конфігурація сортування ПІСЛЯ скидання:", JSON.stringify(defaultConfig));
    
    // Принудительно обновляем состояние и перезагружаем данные
    console.log("Викликаю loadTrades() після скидання сортування");
    setTimeout(() => {
      console.log("setTimeout спрацював для resetSortConfig");
      loadTrades();
    }, 0);
  };

  const handleRowClick = (tradeId, isActionCell) => {
    if (!isActionCell) {
      navigate(`/trade/${tradeId}`);
    }
  };

  const TradeCalendar = () => {
    const [activePairIndex, setActivePairIndex] = useState({});

    useEffect(() => {
      const interval = setInterval(() => {
        setActivePairIndex(prev => {
          const newState = { ...prev };
          weekDates.forEach((date, idx) => {
            const dayTrades = getTradesForDate(date);
            const dayResults = calculateDayResult(dayTrades);
            if (dayResults.pairs.length > 1) {
              const currentIndex = prev[idx] !== undefined ? prev[idx] : 0;
              newState[idx] = (currentIndex + 1) % dayResults.pairs.length;
            }
          });
          return newState;
        });
      }, 2000);

      return () => clearInterval(interval);
    }, []);

    const getCurrentWeekDates = () => {
      const curr = new Date();
      const week = [];
      
      // Змінюємо логіку, щоб неділя належала до поточного тижня
      // Віднімаємо від поточної дати номер дня тижня (0-6, де 0 - неділя)
      // для неділі це буде -0, для понеділка -1, вівторка -2, і т.д.
      curr.setDate(curr.getDate() - ((curr.getDay() + 6) % 7));
      
      for (let i = 0; i < 7; i++) {
        week.push(new Date(curr));
        curr.setDate(curr.getDate() + 1);
      }
      
      return week;
    };

    const weekDates = getCurrentWeekDates();
    const today = new Date();

    const getTradesForDate = (date) => {
      return trades.filter(trade => {
        const tradeDate = new Date(trade.date);
        return tradeDate.toDateString() === date.toDateString();
      });
    };

    const calculateDayResult = (dayTrades) => {
      if (!dayTrades || dayTrades.length === 0) {
        return {
          totalProfitLoss: 0,
          totalGainedPoints: 0,
          pairs: [],
          results: [],
          hasData: false
        };
      }

      let totalProfitLoss = 0;
      let totalGainedPoints = 0;
      const results = [];
      const pairs = [];

      dayTrades.forEach(trade => {
        const profitValue = trade.profitLoss ? 
          parseFloat(trade.profitLoss.replace(/[^-\d.]/g, '')) : 0;
        totalProfitLoss += profitValue;

        const gainedValue = trade.gainedPoints ? 
          parseFloat(trade.gainedPoints.replace(/[^-\d.]/g, '') || 0) : 0;
        totalGainedPoints += gainedValue;

        results.push(trade.result);
        if (trade.pair && !pairs.includes(trade.pair)) {
          pairs.push(trade.pair);
        }
      });

      return {
        totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
        totalGainedPoints: parseFloat(totalGainedPoints.toFixed(2)),
        pairs,
        results,
        hasData: true
      };
    };

    const formatDate = (date) => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    };

    return (
      <TradeCalendarContainer>
        {weekDates.map((date, index) => {
          const dayTrades = getTradesForDate(date);
          const dayResults = calculateDayResult(dayTrades);
          const isToday = date.toDateString() === today.toDateString();
          
          const currentPairIndex = activePairIndex[index] || 0;
          const currentPair = dayResults.pairs[currentPairIndex];

          return (
            <CalendarDay 
              key={index}
              hasData={dayResults.hasData}
              isToday={isToday}
              dayResults={dayResults}
            >
              <CalendarDayHeader>{formatDate(date)}</CalendarDayHeader>
              {dayResults.hasData && (
                <CalendarDayMetrics>
                  <PairContainer>
                    {currentPair && (
                      <PairText key={`${index}-${currentPairIndex}`}>
                        {currentPair}
                      </PairText>
                    )}
                  </PairContainer>
                  <MetricsValue 
                    type={dayResults.totalProfitLoss > 0 ? 'profit' : 'loss'}
                    value={dayResults.totalProfitLoss}
                  >
                    {dayResults.totalProfitLoss === 0 ? '0%' :
                     dayResults.totalProfitLoss > 0 ? `+${dayResults.totalProfitLoss}%` :
                     `${dayResults.totalProfitLoss}%`}
                  </MetricsValue>
                  <MetricsValue 
                    type={dayResults.totalGainedPoints > 0 ? 'profit' : 'loss'}
                    value={dayResults.totalGainedPoints}
                  >
                    {dayResults.totalGainedPoints === 0 ? '$0.00' :
                     dayResults.totalGainedPoints > 0 ? `+$${dayResults.totalGainedPoints.toFixed(2)}` :
                     `$${dayResults.totalGainedPoints.toFixed(2)}`}
                  </MetricsValue>
                </CalendarDayMetrics>
              )}
            </CalendarDay>
          );
        })}
      </TradeCalendarContainer>
    );
  };

  // Функция для применения всех активных фильтров
  const applyFilters = () => {
    console.log("Застосування фільтрів");
    
    // Закрываем все выпадающие меню
    setShowFilterDropdown(false);
    setShowRangeDropdown(false);
    setShowSortDropdown(false);
    
    // Закрываем все dropdown фильтров
    setOpenDropdowns({
      pair: false,
      session: false,
      direction: false,
      result: false
    });
    
    // Перезавантажуємо трейди, щоб оновити відображення
    loadTrades();
  };

  // Функция для сброса всех фильтров, сортировок и диапазона дат
  const clearAllFilters = () => {
    console.log("ВИКОНУЄТЬСЯ: clearAllFilters()");
    console.log("Фільтри ДО очищення:", JSON.stringify(filterCriteria));
    console.log("Діапазон дат ДО очищення:", startDate, endDate);
    console.log("Конфігурація сортування ДО очищення:", JSON.stringify(sortConfig));
    
    // Сбрасываем фильтры на пустые массивы
    setFilterCriteria({
      pair: [],
      session: [],
      direction: [],
      result: []
    });
    
    // Сбрасываем диапазон дат
    setDateRange([null, null]);
    
    // Сбрасываем настройки сортировки
    setSortConfig({
      key: 'date',
      direction: 'desc'
    });
    
    // Очищаем localStorage
    localStorage.removeItem('tradeJournal_filters');
    localStorage.removeItem('tradeJournal_dateRange');
    localStorage.setItem('tradeJournal_sortConfig', JSON.stringify({ key: 'date', direction: 'desc' }));
    
    console.log("Фільтри, дати та сортування ПІСЛЯ очищення встановлені в початковий стан");
    
    // Принудительно обновляем состояние и перезагружаем данные
    console.log("Викликаю loadTrades() після очищення всіх фільтрів");
    setTimeout(() => {
      console.log("setTimeout спрацював для clearAllFilters");
      loadTrades();
    }, 0);
  };

  // Функция для удаления отдельного фильтра
  const handleRemoveFilterValue = (filterName, valueToRemove) => {
    console.log(`ВИКОНУЄТЬСЯ: handleRemoveFilterValue(${filterName}, ${valueToRemove})`);
    console.log(`Фільтри ДО видалення:`, JSON.stringify(filterCriteria));
    
    // Создаем новый объект фильтров
    const newFilters = { ...filterCriteria };
    
    // Удаляем указанное значение из соответствующего массива
    newFilters[filterName] = newFilters[filterName].filter(value => value !== valueToRemove);
    
    console.log(`Фільтри ПІСЛЯ видалення:`, JSON.stringify(newFilters));
    
    // Устанавливаем новые фильтры
    setFilterCriteria(newFilters);
    
    // Сохраняем в localStorage
    localStorage.setItem('tradeJournal_filters', JSON.stringify(newFilters));
    
    // Принудительно обновляем состояние и перезагружаем данные
    console.log("Викликаю loadTrades() після видалення фільтра");
    setTimeout(() => {
      console.log("setTimeout спрацював для handleRemoveFilterValue");
      loadTrades();
    }, 0);
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({
      pair: false,
      session: false,
      direction: false,
      result: false
    });
  };

  // Функция для форматирования дат
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Определяем, есть ли активные фильтры, сортировка или диапазон дат
  const hasActiveFilters = Object.values(filterCriteria).some(value => Array.isArray(value) && value.length > 0) || 
                          startDate || endDate || 
                          (sortConfig.key !== 'date' || sortConfig.direction !== 'desc');

  // Оновлена функція для програмного скидання всіх фільтрів
  const triggerClearFilters = () => {
    console.log("Виклик функції triggerClearFilters");
    
    try {
      console.log("⚠️ Пряме скидання всіх фільтрів");
      
      // Зберігаємо копії попередніх значень для логування
      const oldFilters = JSON.stringify(filterCriteria);
      const oldDateRange = JSON.stringify([startDate, endDate]);
      const oldSortConfig = JSON.stringify(sortConfig);
      
      // Скидаємо всі фільтри
      setFilterCriteria({
        pair: [],
        session: [],
        direction: [],
        result: []
      });
      
      // Скидаємо діапазон дат
      setDateRange([null, null]);
      
      // Скидаємо сортування
      setSortConfig({
        key: 'date',
        direction: 'desc'
      });
      
      // Очищаємо localStorage
      localStorage.removeItem('tradeJournal_filters');
      localStorage.removeItem('tradeJournal_dateRange');
      localStorage.setItem('tradeJournal_sortConfig', JSON.stringify({ key: 'date', direction: 'desc' }));
      
      console.log(`❌ Скинуті фільтри. Старі: ${oldFilters}, Нові: []`);
      console.log(`❌ Скинутий діапазон дат. Старий: ${oldDateRange}, Новий: [null,null]`);
      console.log(`❌ Скинуте сортування. Старе: ${oldSortConfig}, Нове: {"key":"date","direction":"desc"}`);
      
      // Перезавантажуємо трейди з невеликою затримкою для оновлення стану
      console.log("🔄 Заплановано перезавантаження трейдів");
      setTimeout(() => {
        console.log("🔄 Перезавантаження трейдів після скидання всіх фільтрів");
        loadTrades();
      }, 50);
    } catch (error) {
      console.error("❌ Помилка при скиданні всіх фільтрів:", error);
    }
  };

  // Логування змін фільтрів
  React.useEffect(() => {
    console.log("Статус фільтрів змінився. hasActiveFilters:", hasActiveFilters);
    console.log("Фільтри:", filterCriteria);
    console.log("Дати:", startDate, endDate);
    console.log("Сортування:", sortConfig);
  }, [hasActiveFilters, filterCriteria, startDate, endDate, sortConfig]);

  // Функція для відображення активних фільтрів
  const renderActiveFilters = () => {
    // Перевіряємо чи є активні фільтри, сортування або діапазон дат
    if (!hasActiveFilters) return null;
    
    return (
      <ActiveFiltersContainer>
        {/* Відображення фільтрів за полями */}
        {Object.entries(filterCriteria).map(([filterName, values]) => 
          values.length > 0 && values.map(value => (
            <ActiveFilter key={`${filterName}-${value}`}>
              <ActiveFilterLabel>{filterName.charAt(0).toUpperCase() + filterName.slice(1)}:</ActiveFilterLabel>
              <FilterValue>{value}</FilterValue>
              <RemoveFilterButton onClick={() => handleRemoveFilterValue(filterName, value)}>×</RemoveFilterButton>
            </ActiveFilter>
          ))
        )}
        
        {/* Відображення діапазону дат */}
        {(startDate || endDate) && (
          <ActiveFilter>
            <ActiveFilterLabel>Date Range:</ActiveFilterLabel>
            <span>{formatDate(startDate) || 'Start'} - {formatDate(endDate) || 'End'}</span>
            <RemoveFilterButton onClick={clearDateRange}>×</RemoveFilterButton>
          </ActiveFilter>
        )}
        
        {/* Відображення сортування */}
        {(sortConfig.key !== 'date' || sortConfig.direction !== 'desc') && (
          <ActiveFilter>
            <ActiveFilterLabel>Sorted by:</ActiveFilterLabel>
            <span>
              {sortConfig.key.charAt(0).toUpperCase() + sortConfig.key.slice(1)}
              {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
            </span>
            <RemoveFilterButton onClick={resetSortConfig}>×</RemoveFilterButton>
          </ActiveFilter>
        )}
        
        {/* Кнопка очищення всіх фільтрів */}
        {hasActiveFilters && (
          <ClearAllButton onClick={triggerClearFilters}>
            Clear All
          </ClearAllButton>
        )}
      </ActiveFiltersContainer>
    );
  };

  return (
    <>
      <GlobalStyle />
      <DatePickerStyles />
      <TradeJournalContainer ref={containerRef}>
        <Header>
          <BackButton onClick={handleBack} />
          <Title>Trading Journal</Title>
          <Subtitle>Let's analyze your trades!</Subtitle>
        </Header>
        <JournalContent>
          <TradeCalendar />
          <JournalHeader>
            <ButtonGroup>
              <ActionButton primary onClick={handleAddTrade}>Add new Trade</ActionButton>
            </ButtonGroup>
            <ButtonGroup>
              <ActionButton onClick={toggleAllSubtrades} style={{ backgroundColor: 'rgb(92, 157, 245)' }}>
                {allSubtradesExpanded ? 'Hide Subtrades ▲' : 'Show Subtrades ▼'}
              </ActionButton>
              
              <div style={{ position: 'relative' }}>
                <ActionButton 
                  ref={rangeButtonRef}
                  onClick={() => setShowRangeDropdown(!showRangeDropdown)}
                >
                  Range
                </ActionButton>
                {showRangeDropdown && (
                  <RangeDropdown className="range-dropdown">
                    <StyledDatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => setDateRange(update)}
                      isClearable={true}
                      placeholderText="Select date range"
                      dateFormat="yyyy-MM-dd"
                      locale="en-gb"
                    />
                    <FilterButtonGroup>
                      <FilterButton clear onClick={clearDateRange}>Clear</FilterButton>
                      <FilterButton onClick={handleRangeApply}>Apply</FilterButton>
                    </FilterButtonGroup>
                  </RangeDropdown>
                )}
              </div>
              
              <div style={{ position: 'relative' }}>
                <ActionButton 
                  ref={filterButtonRef}
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  Filter
                </ActionButton>
                {showFilterDropdown && (
                  <FilterDropdown className="filter-dropdown">
                    <FilterGroup>
                      <FilterLabel>Pair</FilterLabel>
                      <MultiSelectDropdown className="multi-select-dropdown">
                        <DropdownToggle onClick={() => toggleDropdown('pair')}>
                          {filterCriteria.pair.length > 0 ? (
                            <SelectedItems>
                              {filterCriteria.pair.join(', ')}
                            </SelectedItems>
                          ) : (
                            <SelectedItems>All</SelectedItems>
                          )}
                        </DropdownToggle>
                        <DropdownMenu isOpen={openDropdowns.pair}>
                          {['EURUSD', 'GBPUSD', 'USDJPY', 'GER40', 'XAUUSD', 'XAGUSD'].map(pair => (
                            <FilterOption key={pair}>
                              <label>
                                <FilterCheckbox
                                  name="pair"
                                  value={pair}
                                  checked={filterCriteria.pair.includes(pair)}
                                  onChange={handleFilterChange}
                                />
                                {pair}
                              </label>
                            </FilterOption>
                          ))}
                        </DropdownMenu>
                      </MultiSelectDropdown>
                    </FilterGroup>

                    <FilterGroup>
                      <FilterLabel>Session</FilterLabel>
                      <MultiSelectDropdown className="multi-select-dropdown">
                        <DropdownToggle onClick={() => toggleDropdown('session')}>
                          {filterCriteria.session.length > 0 ? (
                            <SelectedItems>
                              {filterCriteria.session.join(', ')}
                            </SelectedItems>
                          ) : (
                            <SelectedItems>All</SelectedItems>
                          )}
                        </DropdownToggle>
                        <DropdownMenu isOpen={openDropdowns.session}>
                          {['Asia', 'Frankfurt', 'London', 'New York'].map(session => (
                            <FilterOption key={session}>
                              <label>
                                <FilterCheckbox
                                  name="session"
                                  value={session}
                                  checked={filterCriteria.session.includes(session)}
                                  onChange={handleFilterChange}
                                />
                                {session}
                              </label>
                            </FilterOption>
                          ))}
                        </DropdownMenu>
                      </MultiSelectDropdown>
                    </FilterGroup>

                    <FilterGroup>
                      <FilterLabel>Direction</FilterLabel>
                      <MultiSelectDropdown className="multi-select-dropdown">
                        <DropdownToggle onClick={() => toggleDropdown('direction')}>
                          {filterCriteria.direction.length > 0 ? (
                            <SelectedItems>
                              {filterCriteria.direction.join(', ')}
                            </SelectedItems>
                          ) : (
                            <SelectedItems>All</SelectedItems>
                          )}
                        </DropdownToggle>
                        <DropdownMenu isOpen={openDropdowns.direction}>
                          {['Long', 'Short'].map(direction => (
                            <FilterOption key={direction}>
                              <label>
                                <FilterCheckbox
                                  name="direction"
                                  value={direction}
                                  checked={filterCriteria.direction.includes(direction)}
                                  onChange={handleFilterChange}
                                />
                                {direction}
                              </label>
                            </FilterOption>
                          ))}
                        </DropdownMenu>
                      </MultiSelectDropdown>
                    </FilterGroup>

                    <FilterGroup>
                      <FilterLabel>Result</FilterLabel>
                      <MultiSelectDropdown className="multi-select-dropdown">
                        <DropdownToggle onClick={() => toggleDropdown('result')}>
                          {filterCriteria.result.length > 0 ? (
                            <SelectedItems>
                              {filterCriteria.result.join(', ')}
                            </SelectedItems>
                          ) : (
                            <SelectedItems>All</SelectedItems>
                          )}
                        </DropdownToggle>
                        <DropdownMenu isOpen={openDropdowns.result}>
                          {['Win', 'Loss', 'Breakeven', 'Missed'].map(result => (
                            <FilterOption key={result}>
                              <label>
                                <FilterCheckbox
                                  name="result"
                                  value={result}
                                  checked={filterCriteria.result.includes(result)}
                                  onChange={handleFilterChange}
                                />
                                {result}
                              </label>
                            </FilterOption>
                          ))}
                        </DropdownMenu>
                      </MultiSelectDropdown>
                    </FilterGroup>

                    <FilterButtonGroup>
                      <FilterButton clear onClick={handleFilterClear}>Clear</FilterButton>
                      <FilterButton onClick={handleFilterApply}>Apply</FilterButton>
                    </FilterButtonGroup>
                    </FilterDropdown>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <ActionButton 
                  ref={sortButtonRef}
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  Sort
                </ActionButton>
                {showSortDropdown && (
                  <SortDropdown className="sort-dropdown">
                    <SortGroup>
                      <FilterLabel>Sort by</FilterLabel>
                      
                      <SortOption 
                        selected={sortConfig.key === 'date'}
                        onClick={() => handleSort('date')}
                      >
                        <RadioButton selected={sortConfig.key === 'date'} />
                        <span>Date {sortConfig.key === 'date' && 
                          (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
                      </SortOption>

                      <SortOption 
                        selected={sortConfig.key === 'no'}
                        onClick={() => handleSort('no')}
                      >
                        <RadioButton selected={sortConfig.key === 'no'} />
                        <span>No. {sortConfig.key === 'no' && 
                          (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
                      </SortOption>
                      
                      <SortOption 
                        selected={sortConfig.key === 'profitLoss'}
                        onClick={() => handleSort('profitLoss')}
                      >
                        <RadioButton selected={sortConfig.key === 'profitLoss'} />
                        <span>Profit % {sortConfig.key === 'profitLoss' && 
                          (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
                      </SortOption>
                      
                      <SortOption 
                        selected={sortConfig.key === 'gainedPoints'}
                        onClick={() => handleSort('gainedPoints')}
                      >
                        <RadioButton selected={sortConfig.key === 'gainedPoints'} />
                        <span>Profit $ {sortConfig.key === 'gainedPoints' && 
                          (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
                      </SortOption>
                      
                      <SortOption 
                        selected={sortConfig.key === 'result'}
                        onClick={() => handleSort('result')}
                      >
                        <RadioButton selected={sortConfig.key === 'result'} />
                        <span>Result {sortConfig.key === 'result' && 
                          (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
                      </SortOption>
                    </SortGroup>

                    <FilterButtonGroup>
                      <FilterButton 
                        clear 
                        onClick={resetSortConfig}
                      >
                        Reset
                      </FilterButton>
                      <FilterButton onClick={() => setShowSortDropdown(false)}>
                        Apply
                      </FilterButton>
                    </FilterButtonGroup>
                  </SortDropdown>
                )}
              </div>
            </ButtonGroup>
          </JournalHeader>

          <SelectAllContainer>
            <div>
              <Checkbox
                checked={selectedTrades.length === displayedTrades.length && displayedTrades.length > 0}
                onChange={handleSelectAll}
              />
              <span style={{ padding: '7px 0px' }}>Select All Trades</span>
              
              {/* Додаємо відображення активних фільтрів */}
              {renderActiveFilters()}
            </div>
            <div>
              {selectedTrades.length === 1 && (
                <AddSubtradeButton
                  onClick={handleCreateSubtrade}
                >
                  Add Subtrade
                </AddSubtradeButton>
              )}
              {selectedTrades.length > 0 && (
                <DeleteSelectedButton
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  Delete Selected ({selectedTrades.length})
                </DeleteSelectedButton>
              )}
            </div>
          </SelectAllContainer>

          <TableContainer>
            <TradeTable {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <TableHeader {...column.getHeaderProps()} style={{ width: `${column.width}px` }}>
                        {column.render('Header')}
                      </TableHeader>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} style={{ textAlign: 'center' }}>
                      No trades yet
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(row => {
                    prepareRow(row);
                    const isSelected = selectedTrades.includes(row.original.id);
                    const isSubtrade = row.original.parentTradeId;
                    
                    return (
                      <TableRow 
                        key={row.original.id}
                        {...row.getRowProps()} 
                        selected={isSelected}
                        isSubtrade={isSubtrade}
                        onClick={() => handleRowClick(row.original.id, false)}
                        style={{ cursor: 'pointer' }}
                      >
                        {row.cells.map(cell => (
                          <TableCell 
                            key={cell.column.id}
                            {...cell.getCellProps()} 
                            style={{ width: cell.column.width }}
                            column={cell.column.id}
                            value={row.original[cell.column.id]}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (cell.column.id === 'actions') {
                                handleRowClick(row.original.id, true);
                              } else {
                                handleRowClick(row.original.id, false);
                              }
                            }}
                          >
                            {cell.render('Cell')}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                )}
              </tbody>
            </TradeTable>
          </TableContainer>

          {deletePopup && (
            <Popup>
              <p>Want to delete?</p>
              <PopupButton onClick={() => handleDelete(deletePopup)}>Yes</PopupButton>
              <PopupButton onClick={() => setDeletePopup(null)}>No</PopupButton>
            </Popup>
          )}

          {showDeleteConfirmation && (
            <ConfirmationPopup>
              <p>Are you sure you want to delete <span>{selectedTrades.length}</span> selected trades?</p>
              <PopupButton onClick={handleDeleteSelected}>Yes, Delete All</PopupButton>
              <PopupButton onClick={() => setShowDeleteConfirmation(false)}>Cancel</PopupButton>
            </ConfirmationPopup>
          )}
        </JournalContent>
      </TradeJournalContainer>
    </>
  );
}

export default TradeJournal;