import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from 'react-table';
import styled, { createGlobalStyle, css } from 'styled-components';
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
    overflow-y: auto;
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
    font-family: inherit;
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

const TradeJournalContainer = styled.div`
  max-width: 1820px;
  margin: 0 auto;
  background-color: #1a1a1a;
  padding: 20px;
  position: relative;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Header = styled.header`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  padding: 20px 0;
  border-radius: 10px 10px 0 0;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 128px;
  min-height: 6.67vh;
  max-height: 128px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border: none;
  padding: 0;
  width: 200px;
  height: 100%;
  border-radius: 0;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
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
  margin: 0 auto;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

const JournalContent = styled.div`
  margin-top: 148px;
  padding-top: 20px;
  position: relative;
  min-height: calc(100vh - 168px);
  width: 100%;
  overflow-y: visible;
`;

const JournalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  background: ${props => props.primary ? 'conic-gradient(from 45deg, #7425C9, #B886EE)' : '#5C9DF5'};
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  height: 40px;
  width: ${props => props.primary ? '240px' : 'auto'};
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

const TradeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
`;

const TableHeader = styled.th`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border: 1px solid #5e2ca5;
  padding: 12px;
  text-align: left;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const TableCell = styled.td`
  border: 1px solid #5e2ca5;
  padding: 6px;
  text-align: center;
  color: #fff;
  background-color: #2e2e2e;
  position: relative;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${props => props.selected ? 'rgba(116, 37, 201, 0.3)' : '#2e2e2e'};
  }
  &:nth-child(odd) {
    background-color: ${props => props.selected ? 'rgba(116, 37, 201, 0.3)' : '#3e3e3e'};
  }

  ${props => props.selected && css`
    && {
      background-color: rgba(116, 37, 201, 0.3) !important;
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
  gap: 5px;
  justify-content: center;
  align-items: center;
  width: 100%;
  opacity: 1;
`;

const IconButton = styled.button`
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
  position: relative;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.98);
  }

  transition: transform 0.3s ease;

  img {
    width: 16px;
    height: 16px;
  }

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #2e2e2e;
    color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 20;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: #fff;
  height: 40px; // Додаємо фіксовану висоту
`;

const DeleteSelectedButton = styled(ActionButton)`
  background: #ff4757;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
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
    field: 'date',
    order: 'desc'
  });
  const [selectedTrades, setSelectedTrades] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
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

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field ? (prev.order === 'asc' ? 'desc' : 'asc') : 'desc'
    }));
  };

  const filteredTrades = React.useMemo(() => {
    return trades.filter((trade) => {
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
  }, [trades, filterCriteria, startDate, endDate]);

  const sortedAndFilteredTrades = React.useMemo(() => {
    const filtered = filteredTrades;
    
    return [...filtered].sort((a, b) => {
      if (sortConfig.field === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortConfig.field === 'no') {
        // Отримуємо індекс кожного трейду в оригінальному масиві
        const aIndex = trades.findIndex(t => t.id === a.id);
        const bIndex = trades.findIndex(t => t.id === b.id);
        return sortConfig.order === 'asc' ? aIndex - bIndex : bIndex - aIndex;
      }
      return 0;
    });
  }, [filteredTrades, sortConfig]);

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
      setSelectedTrades(sortedAndFilteredTrades.map(trade => trade.id));
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

  const columns = React.useMemo(
    () => [
      { Header: 'Action', accessor: 'action', width: 20 },
      { Header: 'No.', accessor: (row, i) => i + 1, width: 20 },
      { Header: 'Date', accessor: 'date', width: 120 },
      { Header: 'Pair', accessor: 'pair', width: 120 },
      { Header: 'Session', accessor: 'session', width: 100 },
      { Header: 'Direction', accessor: 'direction', width: 100 },
      { Header: 'Result', accessor: 'result', width: 100 },
      { Header: 'Category', accessor: 'tradeClass', width: 80 },
      { Header: 'Profit in %', accessor: 'profitLoss', Cell: ({ value }) => `${value}%`, width: 80 },
      { Header: 'Profit in $', accessor: 'gainedPoints', Cell: ({ value }) => `$${value}`, width: 80 },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ 
    columns, 
    data: sortedAndFilteredTrades 
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

  return (
    <>
      <GlobalStyle />
      <DatePickerStyles />
      <TradeJournalContainer ref={containerRef}>
        <Header>
          <BackButton onClick={handleBack} />
          <Title>Trading Journal</Title>
        </Header>
        <JournalContent>
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
                        selected={sortConfig.field === 'date'}
                        onClick={() => handleSort('date')}
                      >
                        <RadioButton selected={sortConfig.field === 'date'} />
                        <span>Date {sortConfig.field === 'date' && 
                          (sortConfig.order === 'asc' ? '↑' : '↓')}</span>
                      </SortOption>

                      <SortOption 
                        selected={sortConfig.field === 'no'}
                        onClick={() => handleSort('no')}
                      >
                        <RadioButton selected={sortConfig.field === 'no'} />
                        <span>No. {sortConfig.field === 'no' && 
                          (sortConfig.order === 'asc' ? '↑' : '↓')}</span>
                      </SortOption>
                    </SortGroup>

                    <FilterButtonGroup>
                      <FilterButton 
                        clear 
                        onClick={() => {
                          setSortConfig({ field: 'date', order: 'desc' });
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
            <Checkbox
              checked={selectedTrades.length === sortedAndFilteredTrades.length && sortedAndFilteredTrades.length > 0}
              onChange={handleSelectAll}
            />
            <span>Select All Trades</span>
            {selectedTrades.length > 0 && (
              <DeleteSelectedButton
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete Selected ({selectedTrades.length})
              </DeleteSelectedButton>
            )}
          </SelectAllContainer>

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
                rows.map((row) => {
                  prepareRow(row);
                  const isSelected = selectedTrades.includes(row.original.id);
                  return (
                    <TableRow className="table-row" {...row.getRowProps()} selected={isSelected}>
                                            {row.cells.map((cell, index) => (
                        <TableCell {...cell.getCellProps()} style={{ width: `${cell.column.width}px` }}>
                          {index === 0 ? (
                            <ButtonsContainer>
                              <CheckboxContainer className="checkbox-container" selected={isSelected}>
                                <Checkbox
                                  checked={selectedTrades.includes(row.original.id)}
                                  onChange={() => handleSelectTrade(row.original.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </CheckboxContainer>
                              <IconButton 
                                data-tooltip="Change your trade" 
                                onClick={() => handleEdit(row.original.id)}
                              >
                                <img src={EditIcon} alt="Edit" />
                              </IconButton>
                              <IconButton 
                                data-tooltip="Move your trade to trash" 
                                onClick={() => setDeletePopup(row.original.id)}
                              >
                                <img src={DeleteIcon} alt="Delete" />
                              </IconButton>
                            </ButtonsContainer>
                          ) : cell.column.Header === 'No.' ? (
                            <Link 
                              to={`/trade/${row.original.id}`} 
                              style={{ color: '#fff', textDecoration: 'none' }}
                            >
                              {cell.render('Cell')}
                            </Link>
                          ) : (
                            cell.render('Cell')
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </tbody>
          </TradeTable>

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