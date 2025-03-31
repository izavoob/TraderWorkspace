import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from 'react-table';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import EditIcon from '../assets/icons/edit-icon.svg';
import DeleteIcon from '../assets/icons/delete-icon.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shineEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

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
  .react-datepicker__day--keyboard-selected {
    background: conic-gradient(from 45deg, #7425C9, #B886EE);
    color: #fff;
  }

  .react-datepicker__navigation {
    top: 8px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #B886EE;
  }

  .react-datepicker__time-container {
    background-color: #2e2e2e;
    border-left: 1px solid #5e2ca5;
  }

  .react-datepicker__time-box {
    background-color: #2e2e2e;
  }

  .react-datepicker__time-list-item {
    color: #fff;
    background-color: #2e2e2e;
  }

  .react-datepicker__time-list-item:hover {
    background: linear-gradient(45deg, #7425C9, #B886EE);
  }

  .react-datepicker__time-list-item--selected {
    background: conic-gradient(from 45deg, #7425C9, #B886EE) !important;
  }
`;

const DailyRoutineContainer = styled.div`
  max-width: 1820px;
  margin: 0 auto;
  background-color: #1a1a1a;
  padding: 20px;
  position: relative;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 148px;
`;

const Header = styled.header`
  background: linear-gradient(45deg, #7425C9, #B886EE, #7425C9);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  padding: 20px 0;
  border-radius: 10px;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: auto;
  min-height: 6.67vh;
  max-height: 100px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 40px;
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

const Subtitle = styled.h2`
  margin: 5px auto 0;
  font-size: 1.2em;
  color: #ff8c00;
  text-align: center;
  z-index: 1;
  font-weight: normal;
`;

const JournalContent = styled.div`
  padding: 20px;
  width: 100%;
  height: calc(100vh - 148px);
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  margin: 0 10px;
`;

const ActionButton = styled.button`
  background: ${props => props.clear ? '#444' : 'conic-gradient(from 45deg, #7425C9, #B886EE)'};
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  margin-top: 20px;
  position: relative;
  border: 2px solid #5e2ca5;
  border-radius: 10px;
  
  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #2e2e2e;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #2e2e2e;
`;

const Th = styled.th`
  padding: 15px;
  text-align: center;
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: #fff;
  font-weight: bold;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 2px solid #5e2ca5;

  &:first-child {
    border-top-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #5e2ca5;
  background: transparent;
  color: #fff;
  transition: background-color 0.2s ease;
`;

const TableRow = styled.tr`
  position: relative;
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

  ${props => props.isSubsession && css`
    & > td {
      background-color: rgba(92, 157, 245, 0.05) !important;
      border-left: 2px solid #5C9DF5;
      padding-left: 20px !important;
    }

    & > td:first-child::before {
      content: '\u21b3';
      position: absolute;
      left: 5px;
      color: #5C9DF5;
    }
  `}

  &:hover {
    background: rgba(116, 37, 201, 0.3);
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

const EditableSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #5e2ca5;
  background: #3e3e3e;
  color: #fff;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const FilterDropdown = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  width: 250px;
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
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
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 12px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
`;

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  color: #fff;
  border-bottom: 1px solid #5e2ca5;
  margin-bottom: 10px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  appearance: none;
  border: 2px solid #B886EE;
  border-radius: 4px;
  background-color: transparent;
  position: relative;
  transition: all 0.2s ease;

  &:checked {
    background-color: #7425C9;
    &:after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  &:hover {
    border-color: #7425C9;
  }
`;

const DeleteSelectedButton = styled(ActionButton)`
  background: #ff4757;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #2e2e2e;
  padding: 25px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  text-align: center;
  z-index: 1100;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  min-width: 300px;
`;

const PopupButton = styled.button`
  background: ${props => props.cancel ? '#444' : 'conic-gradient(from 45deg, #7425C9, #B886EE)'};
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
  margin: 10px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const AddSubsessionButton = styled(ActionButton)`
  background: #5C9DF5;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

function PostSessionJournal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filterCriteria, setFilterCriteria] = useState({
    pair: '',
    dayNarrative: '',
    realization: '',
    routineExecution: ''
  });
  const [deletePopup, setDeletePopup] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    field: 'date',
    order: 'desc'
  });
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pairOptions, setPairOptions] = useState([]);
  
  const containerRef = useRef(null);
  const filterButtonRef = useRef(null);
  const rangeButtonRef = useRef(null);
  const sortButtonRef = useRef(null);

  useEffect(() => {
      loadData();
      loadPairOptions(); // Добавляем загрузку пар
  }, [location]);

  const loadPairOptions = async () => {
    try {
      const pairs = await window.electronAPI.getAllExecutionItems('pairs');
      setPairOptions(pairs);
    } catch (error) {
      console.error('Error loading pair options:', error);
    }
  };

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

  const loadData = async () => {
      setIsLoading(true);
      try {
          // Вместо запроса "рутины" текущего дня, запрашиваем все постсессии
          const postSessions = await window.electronAPI.getAllPostSessions();
          
          if (postSessions && Array.isArray(postSessions)) {
              // Обрабатываем все постсессии
              const processedData = postSessions.map(entry => ({
                  ...entry,
                  id: String(entry.id || Date.now()),
                  dayNarrative: entry.narrative, // Сопоставление полей
                  realization: entry.execution, // Сопоставление полей
                  // Добавляем weekDay, если его нет
                  weekDay: entry.weekDay || new Date(entry.date).toLocaleString('en-US', { weekday: 'long' })
              }));
              
              setData(processedData);
          } else {
              setData([]);
          }
      } catch (error) {
          console.error('Error in loadData:', error);
          setData([]);
      } finally {
          setIsLoading(false);
      }
  };

  const handleAdd = () => {
      const newId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      const newRecord = {
        id: newId,
        date: new Date().toISOString().split('T')[0],
        weekDay: new Date().toLocaleString('en-US', { weekday: 'long' }),
        pair: '',
        dayNarrative: '',
        realization: '',
        routineExecution: false,
        planOutcome: false
      };

      // Перенаправляем на страницу создания с новым ID
      navigate(`/daily-routine/post-session/${newId}`, { 
        state: { 
          sessionData: newRecord,
          timestamp: Date.now()
        } 
      });
  };

  const handleDelete = (id) => {
    setDeletePopup(id);
};

const confirmDelete = async (id) => {
    try {
        await window.electronAPI.deletePostSession(id);
        loadData();
        setDeletePopup(null);
    } catch (error) {
        console.error('Error deleting entry:', error);
    }
};

  const handleSelectEntry = (entryId) => {
      setSelectedEntries(prev => {
          if (prev.includes(entryId)) {
              return prev.filter(id => id !== entryId);
          } else {
              return [...prev, entryId];
          }
      });
  };

  const handleSelectAll = (e) => {
      if (e.target.checked) {
          setSelectedEntries(data.map(entry => entry.id));
      } else {
          setSelectedEntries([]);
      }
  };

  const handleDeleteSelected = async () => {
      try {
          for (const id of selectedEntries) {
              await window.electronAPI.deletePostSession(id);
          }
          loadData();
          setSelectedEntries([]);
          setShowDeleteConfirmation(false);
      } catch (error) {
          console.error('Error deleting entries:', error);
      }
  };

  const handleBack = () => {
      navigate('/daily-routine');
  };

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
          dayNarrative: '',
          realization: '',
          routineExecution: ''
      });
      setDateRange([null, null]);
  };

  const handleFilterApply = () => {
      setShowFilterDropdown(false);
  };

  const handleRangeApply = () => {
      setShowRangeDropdown(false);
  };

  const handleSortChange = (e) => {
      const [field, order] = e.target.value.split('-');
      setSortConfig({ field, order });
      setShowSortDropdown(false);
  };

  const handleEdit = (id) => {
      const entryToEdit = data.find(entry => String(entry.id) === String(id));
      if (entryToEdit) {
          navigate(`/daily-routine/post-session/${id}`, { 
              state: { 
                  sessionData: entryToEdit,
                  timestamp: Date.now()
              } 
          });
      }
  };

  const handleTableFieldChange = async (id, field, value) => {
    try {
      const entryToUpdate = data.find(entry => entry.id === id);
      if (!entryToUpdate) return;
      
      const updatedEntry = { ...entryToUpdate };
      
      if (field === 'pair') updatedEntry.pair = value;
      else if (field === 'dayNarrative') updatedEntry.narrative = value;
      else if (field === 'realization') updatedEntry.execution = value;
      else if (field === 'routineExecution') updatedEntry.routineExecution = value;
      else if (field === 'planOutcome') updatedEntry.planOutcome = value;
      
      await window.electronAPI.updatePostSession(updatedEntry);
      
      setData(prevData => 
        prevData.map(item => item.id === id ? { ...item, [field]: value } : item)
      );
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const filteredEntries = React.useMemo(() => {
      return data.filter((entry) => {
          if (!entry) return false;
          
          const entryDate = entry.date ? new Date(entry.date) : null;
          
          const inDateRange = startDate && endDate && entryDate ? 
              (entryDate >= startDate && entryDate <= endDate) : true;

          const matchesPair = !filterCriteria.pair || entry.pair === filterCriteria.pair;
          const matchesDayNarrative = !filterCriteria.dayNarrative || entry.dayNarrative === filterCriteria.dayNarrative;
          const matchesRealization = !filterCriteria.realization || entry.realization === filterCriteria.realization;

          return inDateRange && matchesPair && matchesDayNarrative && matchesRealization;
      });
  }, [data, filterCriteria, startDate, endDate]);

  const sortedAndFilteredEntries = React.useMemo(() => {
      const sorted = [...filteredEntries].sort((a, b) => {
          if (sortConfig.field === 'date') {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return sortConfig.order === 'desc' ? dateB - dateA : dateA - dateB;
          }
          return 0;
      });
      return sorted;
  }, [filteredEntries, sortConfig]);

  const columns = React.useMemo(
      () => [
      { 
          Header: 'Action', 
          accessor: 'action',
          width: 20,
          Cell: ({ row }) => (
          <ButtonsContainer>
              <Checkbox
              checked={selectedEntries.includes(row.original.id)}
              onChange={(e) => {
                  e.stopPropagation();
                  handleSelectEntry(row.original.id);
              }}
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
      { 
        Header: 'Pair', 
        accessor: 'pair',
        width: 120,
        Cell: ({ row, value }) => (
          <EditableSelect
            value={value || ''}
            onChange={(e) => handleTableFieldChange(row.original.id, 'pair', e.target.value)}
          >
            <option value="">Select</option>
            {pairOptions.map(pair => (
              <option key={pair.id} value={pair.name}>{pair.name}</option>
            ))}
          </EditableSelect>
        ),
      },
      { Header: 'Date', accessor: 'date', width: 120 },
      { Header: 'WeekDay', accessor: 'weekDay', width: 120 },
      {
          Header: 'Day Narrative',
          accessor: 'dayNarrative',
          width: 120,
          Cell: ({ row, value }) => (
          <EditableSelect
              value={value || ''}
              onChange={(e) => handleTableFieldChange(row.original.id, 'dayNarrative', e.target.value)}
          >
              <option value="">Select</option>
              <option value="Bullish">Bullish</option>
              <option value="Bearish">Bearish</option>
              <option value="Neutral">Neutral</option>
              <option value="Day off">Day off</option>
          </EditableSelect>
          ),
      },
      {
          Header: 'Realization',
          accessor: 'realization',
          width: 120,
          Cell: ({ row, value }) => (
          <EditableSelect
              value={value || ''}
              onChange={(e) => handleTableFieldChange(row.original.id, 'realization', e.target.value)}
          >
              <option value="">Not Provided</option>
              <option value="Good">Good</option>
              <option value="Bad">Bad</option>
              <option value="Acceptable">Acceptable</option>
          </EditableSelect>
          ),
      },
      {
          Header: 'Routine Execution',
          accessor: 'routineExecution',
          width: 120,
          Cell: ({ row }) => (
          <Checkbox
              type="checkbox"
              checked={row.original.routineExecution || false}
              disabled={false}
              onChange={(e) => {
                  handleTableFieldChange(row.original.id, 'routineExecution', e.target.checked);
              }}
          />
          ),
      },
      {
          Header: 'Plan&Outcome',
          accessor: 'planOutcome',
          width: 120,
          Cell: ({ row }) => {
          return (
              <Checkbox
              type="checkbox"
              checked={row.original.planOutcome || false}
              disabled={false}
              onChange={(e) => {
                  handleTableFieldChange(row.original.id, 'planOutcome', e.target.checked);
              }}
              />
          );
          },
      },
      ],
      [data, selectedEntries, pairOptions]
  );

  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
  } = useTable({ 
      columns, 
      data: sortedAndFilteredEntries,
      initialState: {
          sortBy: [{ id: 'date', desc: true }]
      }
  });

  return (
      <>
      <GlobalStyle />
      <DatePickerStyles />
      <DailyRoutineContainer>
          <Header>
          <BackButton onClick={handleBack} />
          <Title>Post-Session Analysis Journal</Title>
          </Header>
          <JournalContent>
          <JournalHeader>
              <ButtonGroup>
              <ActionButton primary onClick={handleAdd}>
                  Add new Post-Session
              </ActionButton>
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
                      <FilterButton clear onClick={() => setDateRange([null, null])}>
                          Clear
                      </FilterButton>
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
                          {pairOptions.map(pair => (
                            <option key={pair.id} value={pair.name}>{pair.name}</option>
                          ))}
                      </FilterSelect>
                      </FilterGroup>

                      <FilterGroup>
                      <FilterLabel>Day Narrative</FilterLabel>
                      <FilterSelect
                          name="dayNarrative"
                          value={filterCriteria.dayNarrative}
                          onChange={handleFilterChange}
                      >
                          <option value="">All Narratives</option>
                          <option value="Bullish">Bullish</option>
                          <option value="Bearish">Bearish</option>
                          <option value="Neutral">Neutral</option>
                          <option value="Day off">Day off</option>
                      </FilterSelect>
                      </FilterGroup>

                      <FilterGroup>
                      <FilterLabel>Realization</FilterLabel>
                      <FilterSelect
                          name="realization"
                          value={filterCriteria.realization}
                          onChange={handleFilterChange}
                      >
                          <option value="">All Realizations</option>
                          <option value="Good">Good</option>
                          <option value="Bad">Bad</option>
                          <option value="Acceptable">Acceptable</option>
                          <option value="Not Provided">Not Provided</option>
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
                      <FilterSelect
                          value={`${sortConfig.field}-${sortConfig.order}`}
                          onChange={handleSortChange}
                      >
                          <option value="date-desc">Date (Newest First)</option>
                          <option value="date-asc">Date (Oldest First)</option>
                      </FilterSelect>
                      </SortGroup>
                  </SortDropdown>
                  )}
              </div>
              </ButtonGroup>
          </JournalHeader>

          <SelectAllContainer>
              <Checkbox
              checked={selectedEntries.length === data.length && data.length > 0}
              onChange={handleSelectAll}
              />
              <span>Select All Entries</span>
              {selectedEntries.length > 0 && (
              <DeleteSelectedButton
                  onClick={() => setShowDeleteConfirmation(true)}
              >
                  Delete Selected ({selectedEntries.length})
              </DeleteSelectedButton>
              )}
          </SelectAllContainer>

          <TableContainer>
              <Table {...getTableProps()}>
              <thead>
                  {headerGroups.map(headerGroup => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                      <Th {...column.getHeaderProps()} style={{ width: column.width }}>
                          {column.render('Header')}
                      </Th>
                      ))}
                  </TableRow>
                  ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                  {rows.length === 0 ? (
                  <TableRow>
                      <Td colSpan={columns.length} style={{ textAlign: 'center' }}>
                      No entries yet
                      </Td>
                  </TableRow>
                  ) : (
                  rows.map(row => {
                      prepareRow(row);
                      const isSelected = selectedEntries.includes(row.original.id);
                      const isSubsession = Boolean(row.original.parentSessionId);
                      
                      return (
                      <TableRow 
                          key={row.original.id} 
                          {...row.getRowProps()} 
                          selected={isSelected}
                          isSubsession={isSubsession}
                      >
                          {row.cells.map(cell => (
                          <Td 
                              key={cell.column.id}
                              {...cell.getCellProps()}
                              style={{
                              width: cell.column.width
                              }}
                          >
                              {cell.render('Cell')}
                          </Td>
                          ))}
                      </TableRow>
                      );
                  })
                  )}
              </tbody>
              </Table>
          </TableContainer>

          {deletePopup && (
              <Popup>
              <p>Want to delete?</p>
              <PopupButton onClick={() => confirmDelete(deletePopup)}>Yes</PopupButton>
              <PopupButton onClick={() => setDeletePopup(null)}>No</PopupButton>
              </Popup>
          )}

          {showDeleteConfirmation && (
              <Popup>
              <p>Are you sure you want to delete <span style={{ color: '#ff4757' }}>{selectedEntries.length}</span> selected entries?</p>
              <PopupButton onClick={handleDeleteSelected}>Yes, Delete All</PopupButton>
              <PopupButton onClick={() => setShowDeleteConfirmation(false)}>Cancel</PopupButton>
              </Popup>
          )}
          </JournalContent>
      </DailyRoutineContainer>
      </>
  );
}

export default PostSessionJournal;