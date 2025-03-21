import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from 'react-table';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import EditIcon from '../assets/icons/edit-icon.svg';
import DeleteIcon from '../assets/icons/delete-icon.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
  
`;

const JournalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  min-height: 50px;
  flex-direction: row;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ActionButton = styled.button`
  background-color: #5e2ca5;
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
    background-color: #4a1a8d;
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
  border: 1px solid #5e2ca5;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  width: 300px;
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
  margin-bottom: 5px;
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
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
`;

const FilterButton = styled.button`
  background: ${props => props.clear ? '#444' : 'conic-gradient(from 45deg, #7425C9, #B886EE)'};
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
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
  width: 100%;
  cursor: pointer;
  font-size: 11px;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const TableContainer = styled.div`
  flex: 1;
  bottom: 15px;
  overflow: auto;
  margin-top: 20px;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  
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
  }
  
  ::-webkit-scrollbar {
    width: 0px;
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

const TradeTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 1px;
  background-color: #2e2e2e;

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
  color: #fff;
  background-color: #1a1a1a;
  position: relative;
`;

const TableRow = styled.tr`
  position: relative;
  &:hover {
      background-color: background: #7425c9;
      opacity: 0.5;
      transition: transform 0.5s ease;
      overflow: hidden;
    }

  
  &:nth-child(even) {
    background-color: ${props => props.selected ? 'rgba(116, 37, 201, 0.3)' : '#252525'};
  }
  &:nth-child(odd) {
    background-color: ${props => props.selected ? 'rgba(116, 37, 201, 0.3)' : '#3e3e3e'};
  }

  ${props => props.selected && css`
    && {
      background-color: rgba(116, 37, 201, 0.3) !important;
    }
  `}

  ${props => props.isSubtrade && css`
    & > td {
      background-color: rgba(92, 157, 245, 0.05) !important;
      padding-left: 20px !important;
    }

    & > td:first-child::before {
      content: '↳';
      position: absolute;
      left: 5px;
      color: #5C9DF5;
    }
  `}

  &:hover {
    .checkbox-container {
      opacity: ${props => props.selected ? 1 : 0.8};
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  white-space: nowrap;
  width: auto;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 20px;
    height: 20px;
  }
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

const CheckboxContainer = styled.div`
  opacity: ${props => props.selected ? 1 : 0};
  transition: opacity 0.2s ease;

  ${TableRow}:hover & {
    opacity: 0.8;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
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
`;

const AddSubtradeButton = styled(ActionButton)`
  background: #5C9DF5;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
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
  gap: 12px;
  margin-top: 16px;
  color: #fff;
  height: 40px;

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
  margin: 20px 0;
  width: 100%;
`;

const CalendarDay = styled.div`
  flex: 1;
  background-color: #252525;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  height: 130px;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  opacity: 0.6;
  transition: opacity 0.3s ease;
  box-sizing: border-box;

  ${props => props.hasData && `
    opacity: 1;
  `}

  ${props => props.isToday && `
    border: 2px solid transparent linear-gradient(45deg, #7425c9, #b886ee) border-box;
  `}

  ${props => props.result === 'Win' && `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0, 230, 118, 0.3), transparent);
      border-radius: 8px;
    }
  `}

  ${props => props.result === 'Loss' && `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(255, 82, 82, 0.3), transparent);
      border-radius: 8px;
    }
  `}

  ${props => props.result === 'Breakeven' && `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(255, 147, 0, 0.3), transparent);
      border-radius: 8px;
    }
  `}

  ${props => (!props.result || props.result === '') && `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent);
      border-radius: 8px;
    }
  `}

  ${props => props.result === 'Missed' && `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(74, 42, 140, 0.3), transparent);
      border-radius: 8px;
    }
  `}
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
`;

const MetricsValue = styled.span`
  ${props => props.type === 'profit' && `color: #00e676;`}
  ${props => props.type === 'loss' && `color: #ff5252;`}
  ${props => props.type === 'breakeven' && `color: #ff9300;`}
  ${props => props.type === 'missed' && `color: #9370db;`}
  font-weight: bold;
`;

function TradeJournal() {
  const [trades, setTrades] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filterCriteria, setFilterCriteria] = useState({
    pair: '',
    session: '',
    direction: '',
    result: ''
  });
  const [deletePopup, setDeletePopup] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  const [selectedTrades, setSelectedTrades] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tradeRelations, setTradeRelations] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const hasRendered = useRef(false);
  const containerRef = useRef(null);
  const filterButtonRef = useRef(null);
  const rangeButtonRef = useRef(null);
  const sortButtonRef = useRef(null);

  useEffect(() => {
    const loadTrades = async () => {
      try {
        const loadedTrades = await window.electronAPI.getTrades();
        setTrades(loadedTrades || []);
      } catch (error) {
        console.error('Error loading trades:', error);
        setTrades([]);
      }
    };
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc'
    }));
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
    // Спочатку фільтруємо
    const filtered = trades.filter((trade) => {
      if (!trade) return false;
      
      const tradeDate = trade.date ? new Date(trade.date) : null;
      const inDateRange = startDate && endDate && tradeDate ? 
        (tradeDate >= startDate && tradeDate <= new Date(endDate.setHours(23, 59, 59, 999))) : true;
  
      const matchesPair = !filterCriteria.pair || trade.pair === filterCriteria.pair;
      const matchesSession = !filterCriteria.session || trade.session === filterCriteria.session;
      const matchesDirection = !filterCriteria.direction || trade.direction === filterCriteria.direction;
      const matchesResult = !filterCriteria.result || trade.result === filterCriteria.result;
  
      return inDateRange && matchesPair && matchesSession && matchesDirection && matchesResult;
    });

    return sortTrades(filtered);
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
      setSelectedTrades(filteredAndSortedTrades.map(trade => trade.id));
    } else {
      setSelectedTrades([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedTrades.map(id => window.electronAPI.deleteTrade(id)));
      setTrades(trades.filter(trade => !selectedTrades.includes(trade.id)));
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
      setTradeRelations(prev => ({
        ...prev,
        [selectedTrade.id]: [...(prev[selectedTrade.id] || []), subtrade.id]
      }));

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
        width: 70,
        Cell: ({ row }) => (
          <ButtonsContainer>
            <Checkbox
              type="checkbox"
              checked={selectedTrades.includes(row.original.id)}
              onChange={() => handleSelectTrade(row.original.id)}
            />
            <ActionButton onClick={() => handleEdit(row.original.id)} style={{ padding: '8px', minWidth: 'auto' }}>
              <img src={EditIcon} alt="Edit" style={{ width: '20px', height: '20px' }} />
            </ActionButton>
            <ActionButton 
              onClick={() => handleDelete(row.original.id)} 
              style={{ padding: '8px', minWidth: 'auto', background: '#ff4757' }}
            >
              <img src={DeleteIcon} alt="Delete" style={{ width: '20px', height: '20px' }} />
            </ActionButton>
          </ButtonsContainer>
        )
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
    [selectedTrades] // Додаємо залежність від selectedTrades
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ 
    columns, 
    data: filteredAndSortedTrades,
    initialState: {
      sortBy: [{ id: 'no', desc: true }]
    }
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterClear = () => {
    setFilterCriteria({
      pair: '',
      session: '',
      direction: '',
      result: ''
    });
  };
  
  const handleFilterApply = () => {
    setShowFilterDropdown(false);
  };

  const handleRangeApply = () => {
    setShowRangeDropdown(false);
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
      await window.electronAPI.deleteTrade(tradeId);
      setTrades(trades.filter((trade) => trade.id !== tradeId));
      setDeletePopup(null);
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  const TradeCalendar = () => {
    // Get current week dates
    const getCurrentWeekDates = () => {
      const curr = new Date();
      const week = [];
      
      // Starting Monday
      curr.setDate(curr.getDate() - curr.getDay() + 1);
      
      for (let i = 0; i < 7; i++) {
        week.push(new Date(curr));
        curr.setDate(curr.getDate() + 1);
      }
      
      return week;
    };
  
    const weekDates = getCurrentWeekDates();
    const today = new Date();
  
    // Get trades for specific date
    const getTradeForDate = (date) => {
      return trades.find(trade => {
        const tradeDate = new Date(trade.date);
        return tradeDate.toDateString() === date.toDateString();
      });
    };
  
    const formatDate = (date) => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    };
  
    return (
      <TradeCalendarContainer>
        {weekDates.map((date, index) => {
          const trade = getTradeForDate(date);
          const isToday = date.toDateString() === today.toDateString();
  
            return (
            <CalendarDay 
              key={index}
              hasData={!!trade}
              isToday={isToday}
              result={trade?.result}
            >
              <CalendarDayHeader>{formatDate(date)}</CalendarDayHeader>
              {trade && (
              <CalendarDayMetrics>
                {trade.pair}<br/>
                <MetricsValue 
                type={
                  trade.result === 'Win' ? 'profit' :
                  trade.result === 'Loss' ? 'loss' :
                  trade.result === 'Breakeven' ? 'breakeven' : 'missed'
                }
                >
                {trade.result === 'Win' ? `+${trade.profitLoss}%` :
                 trade.result === 'Loss' ? `${trade.profitLoss}%` :
                 `${trade.profitLoss}%`}
                </MetricsValue>
              </CalendarDayMetrics>
              )}
            </CalendarDay>
            );
        })}
      </TradeCalendarContainer>
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
                    />
                    <FilterButtonGroup>
                      <FilterButton clear onClick={() => setDateRange([null, null])}>Clear</FilterButton>
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
                      <FilterSelect
                        name="pair"
                        value={filterCriteria.pair}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Pairs</option>
                        <option value="EURUSD">EURUSD</option>
                        <option value="GBPUSD">GBPUSD</option>
                        <option value="USDJPY">USDJPY</option>
                        <option value="GER40">GER40</option>
                        <option value="XAUUSD">XAUUSD</option>
                        <option value="XAGUSD">XAGUSD</option>
                      </FilterSelect>
                    </FilterGroup>

                    <FilterGroup>
                      <FilterLabel>Session</FilterLabel>
                      <FilterSelect
                        name="session"
                        value={filterCriteria.session}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Sessions</option>
                        <option value="Asia">Asia</option>
                        <option value="Frankfurt">Frankfurt</option>
                        <option value="London">London</option>
                        <option value="New York">New York</option>
                      </FilterSelect>
                    </FilterGroup>

                    <FilterGroup>
                      <FilterLabel>Direction</FilterLabel>
                      <FilterSelect
                        name="direction"
                        value={filterCriteria.direction}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Directions</option>
                        <option value="Long">Long</option>
                        <option value="Short">Short</option>
                      </FilterSelect>
                    </FilterGroup>

                    <FilterGroup>
                      <FilterLabel>Result</FilterLabel>
                      <FilterSelect
                        name="result"
                        value={filterCriteria.result}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Results</option>
                        <option value="Win">Win</option>
                        <option value="Loss">Loss</option>
                        <option value="Breakeven">Breakeven</option>
                        <option value="Missed">Missed</option>
                      </FilterSelect>
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
                    </SortGroup>

                    <FilterButtonGroup>
                      <FilterButton 
                        clear 
                        onClick={() => {
                          setSortConfig({ key: 'date', direction: 'desc' });
                          setShowSortDropdown(false);
                        }}
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
                checked={selectedTrades.length === filteredAndSortedTrades.length && filteredAndSortedTrades.length > 0}
                onChange={handleSelectAll}
              />
              <span>Select All Trades</span>
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
                      >
                        {row.cells.map(cell => (
                          <TableCell 
                            key={cell.column.id}
                            {...cell.getCellProps()} 
                            style={{ width: cell.column.width }}
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