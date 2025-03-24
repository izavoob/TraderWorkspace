import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from 'react-table';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import EditIcon from '../assets/icons/edit-icon.svg';
import DeleteIcon from '../assets/icons/delete-icon.svg';
import AddPairIcon from '../assets/icons/add-pair-icon.svg';
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
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  bottom: 25px;
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
  width: 100%;
  height: calc(100vh - 148px);
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
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

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  
  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #2e2e2e;
  }

  tbody {
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

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
`;

const Th = styled.th`
  padding: 12px;
  text-align: center;
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: #fff;
  font-weight: bold;
  border: 1px solid #5e2ca5;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

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

const Td = styled.td`
  border: 1px solid #5e2ca5;
  padding: 6px;
  text-align: center;
  color: #fff;
  background-color: #2e2e2e;
  position: relative;
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
      content: '↳';
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
  top: 100%;
  right: 0;
  width: 200px;
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  color: #fff;
  height: 40px;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #5e2ca5;
  text-align: center;
  z-index: 1000;
  color: white;
`;

const PopupButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin: 0 10px;
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

function PreSessionJournal() {
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
    narrative: '',
    execution: '',
    outcome: ''
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
  const [parentSessions, setParentSessions] = useState({});

  const containerRef = useRef(null);
  const filterButtonRef = useRef(null);
  const rangeButtonRef = useRef(null);
  const sortButtonRef = useRef(null);

  useEffect(() => {
    loadData();
    loadPairOptions();
  }, [location]);

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
    try {
      setIsLoading(true);
      const presessions = await window.electronAPI.getAllPresessions();
      console.log('Raw presessions:', presessions);
      
      const processedData = presessions.map(presession => ({
        id: presession.id,
        date: presession.date,
        weekDay: new Date(presession.date).toLocaleDateString('en-US', { weekday: 'long' }),
        pair: presession.pair || '',
        narrative: presession.narrative || '',
        execution: presession.execution || '',
        outcome: presession.outcome || '',
        planOutcome: presession.plan_outcome === 1,
        parentSessionId: presession.parentSessionId || null
      }));

      console.log('Processed presessions with parentSessionId:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('Error loading presessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPairOptions = async () => {
    try {
      const pairs = await window.electronAPI.getAllExecutionItems('pairs');
      setPairOptions(pairs);
    } catch (error) {
      console.error('Error loading pair options:', error);
    }
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
      narrative: '',
      execution: '',
      outcome: ''
    });
  };

  const handleFilterApply = () => {
    setShowFilterDropdown(false);
  };

  const handleRangeApply = () => {
    setShowRangeDropdown(false);
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
        await window.electronAPI.deletePresession(id);
      }
      setData(prevData => prevData.filter(item => !selectedEntries.includes(item.id)));
      setSelectedEntries([]);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting selected presessions:', error);
    }
  };

  const handleAdd = () => {
    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weekDay: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      pair: '',
      narrative: '',
      execution: '',
      outcome: '',
      planOutcome: false,
      forex_factory_news: JSON.stringify([]),
      topDownAnalysis: JSON.stringify([]),
      video_url: '',
      plans: JSON.stringify({
        narrative: { text: '' },
        execution: { text: '' },
        outcome: { text: '' }
      }),
      chart_processes: JSON.stringify([]),
      mindset_preparation: JSON.stringify({
        anythingCanHappen: false,
        futureKnowledge: false,
        randomDistribution: false,
        edgeDefinition: false,
        uniqueMoments: false
      }),
      the_zone: JSON.stringify([
        { id: 1, text: "I objectively identify my edges", accepted: false },
        { id: 2, text: "I act on my edges without reservation or hesitation", accepted: false },
        { id: 3, text: "I completely accept the risk or I am willing to let go of the trade", accepted: false },
        { id: 4, text: "I continually monitor my susceptibility for making errors", accepted: false },
        { id: 5, text: "I pay myself as the market makes money available to me", accepted: false },
        { id: 6, text: "I predefine the risk of every trade", accepted: false },
        { id: 7, text: "I understand the absolute necessity of these principles of consistent success and, therefore, never violate them", accepted: false }
      ])
    };

    navigate('/daily-routine/pre-session/full', { state: { sessionData: newRecord } });
  };

  const handleEdit = (id) => {
    const entryToEdit = data.find(entry => String(entry.id) === String(id));
    if (entryToEdit) {
      navigate(`/daily-routine/pre-session/full/${id}`);
    }
  };

  const handleDelete = async (id) => {
    setDeletePopup(id);
  };

  const confirmDelete = async (id) => {
    try {
      await window.electronAPI.deletePresession(id);
      setData(prevData => prevData.filter(entry => entry.id !== id));
      setDeletePopup(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleBack = () => {
    navigate('/daily-routine');
  };

  const filteredEntries = useMemo(() => {
    return data.filter((entry) => {
      if (!entry) return false;
      
      const entryDate = entry.date ? new Date(entry.date) : null;
      
      const inDateRange = startDate && endDate && entryDate ? 
        (entryDate >= startDate && entryDate <= new Date(endDate.setHours(23, 59, 59, 999))) : true;

      const matchesPair = !filterCriteria.pair || entry.pair === filterCriteria.pair;
      const matchesNarrative = !filterCriteria.narrative || entry.narrative === filterCriteria.narrative;
      const matchesExecution = !filterCriteria.execution || entry.execution === filterCriteria.execution;
      const matchesOutcome = !filterCriteria.outcome || entry.outcome === filterCriteria.outcome;

      return inDateRange && matchesPair && matchesNarrative && matchesExecution && matchesOutcome;
    });
  }, [data, filterCriteria, startDate, endDate]);

  const sortedAndFilteredEntries = useMemo(() => {
    const sessionGroups = filteredEntries.reduce((groups, entry) => {
      if (!entry.parentSessionId) {
        // Основная сессия
        if (!groups[entry.id]) {
          groups[entry.id] = {
            main: entry,
            subsessions: []
          };
        } else {
          groups[entry.id].main = entry;
        }
      } else {
        // Дочерняя сессия
        if (!groups[entry.parentSessionId]) {
          groups[entry.parentSessionId] = {
            main: null,
            subsessions: [entry]
          };
        } else {
          groups[entry.parentSessionId].subsessions.push(entry);
        }
      }
      return groups;
    }, {});

    // Сортируем основные сессии
    const mainSessions = Object.values(sessionGroups)
      .filter(group => group.main)
      .map(group => group.main)
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.order === 'desc' ? dateB - dateA : dateA - dateB;
      });

    // Формируем финальный массив, добавляя дочерние сессии после родительских
    return mainSessions.reduce((result, mainSession) => {
      result.push(mainSession);
      const subsessions = sessionGroups[mainSession.id]?.subsessions || [];
      if (subsessions.length > 0) {
        result.push(...subsessions.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortConfig.order === 'desc' ? dateB - dateA : dateA - dateB;
        }));
      }
      return result;
    }, []);
  }, [filteredEntries, sortConfig]);

  const columns = useMemo(
    () => [
      {
        Header: 'Actions',
        accessor: 'actions',
        width: 80, // Уменьшаем ширину, так как убрали кнопку
        Cell: ({ row }) => (
          <ButtonsContainer>
            <Checkbox
              type="checkbox"
              checked={selectedEntries.includes(row.original.id)}
              onChange={() => handleSelectEntry(row.original.id)}
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
      { Header: 'Date', accessor: 'date', width: 120 },
      { Header: 'Week Day', accessor: 'weekDay', width: 120 },
      {
        Header: 'Pair',
        accessor: 'pair',
        width: 120,
        Cell: ({ row, value }) => (
          <EditableSelect
            value={value || ''}
            onChange={(e) => {
              const updatedData = data.map(item => {
                if (item.id === row.original.id) {
                  return { ...item, pair: e.target.value };
                }
                return item;
              });
              
              setData(updatedData);
              
              window.electronAPI.savePresession({
                ...row.original,
                pair: e.target.value
              });
            }}
          >
            <option value="">Select</option>
            {pairOptions.map(pair => (
              <option key={pair.id} value={pair.name}>{pair.name}</option>
            ))}
          </EditableSelect>
        ),
      },
      {
        Header: 'Narrative',
        accessor: 'narrative',
        width: 120,
        Cell: ({ row, value }) => (
          <EditableSelect
            value={value || ''}
            onChange={(e) => {
              const newNarrative = e.target.value;
              const currentOutcome = row.original.outcome;
              
              let shouldCheck = false;
              if (newNarrative !== 'Neutral' && newNarrative !== 'Day off') {
                shouldCheck = newNarrative === currentOutcome;
              }

              const updatedData = data.map(item => {
                if (item.id === row.original.id) {
                  return { 
                    ...item, 
                    narrative: newNarrative,
                    planOutcome: shouldCheck 
                  };
                }
                return item;
              });
              
              setData(updatedData);
              
              window.electronAPI.savePresession({
                ...row.original,
                narrative: newNarrative,
                plan_outcome: shouldCheck ? 1 : 0
              });
            }}
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
        Header: 'Execution',
        accessor: 'execution',
        width: 120,
        Cell: ({ row, value }) => (
          <EditableSelect
            value={value || ''}
            onChange={(e) => {
              const updatedData = data.map(item => {
                if (item.id === row.original.id) {
                  return { ...item, execution: e.target.value };
                }
                return item;
              });
              
              setData(updatedData);
              
              window.electronAPI.savePresession({
                ...row.original,
                execution: e.target.value
              });
            }}
          >
            <option value="">Select</option>
            <option value="Day off">Day off</option>
            <option value="No Trades">No Trades</option>
            <option value="Skipped">Skipped</option>
            <option value="Missed">Missed</option>
            <option value="BE">BE</option>
            <option value="Loss">Loss</option>
            <option value="Win">Win</option>
          </EditableSelect>
        ),
      },
      {
        Header: 'Outcome',
        accessor: 'outcome',
        width: 120,
        Cell: ({ row, value }) => (
          <EditableSelect
            value={value || ''}
            onChange={(e) => {
              const newOutcome = e.target.value;
              const currentNarrative = row.original.narrative;
              
              let shouldCheck = false;
              if (currentNarrative !== 'Neutral' && currentNarrative !== 'Day off') {
                shouldCheck = newOutcome === currentNarrative;
              }

              const updatedData = data.map(item => {
                if (item.id === row.original.id) {
                  return { 
                    ...item, 
                    outcome: newOutcome,
                    planOutcome: shouldCheck 
                  };
                }
                return item;
              });
              
              setData(updatedData);
              
              window.electronAPI.savePresession({
                ...row.original,
                outcome: newOutcome,
                plan_outcome: shouldCheck ? 1 : 0
              });
            }}
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
        Header: 'Plan & Outcome',
        accessor: 'planOutcome',
        width: 120,
        Cell: ({ row }) => {
          const shouldBeChecked = (() => {
            const narrative = row.original.narrative;
            const outcome = row.original.outcome;
            
            if (!narrative || !outcome || 
                narrative === 'Neutral' || 
                narrative === 'Day off') {
              return false;
            }
            
            return narrative === outcome;
          })();

          return (
            <Checkbox
              type="checkbox"
              checked={shouldBeChecked}
              disabled={true}
              onChange={() => {}}
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
    data: sortedAndFilteredEntries 
  });

  const handleCreateSubsession = async (parentId) => {
    try {
      // Получаем родительскую сессию
      const parentSession = data.find(entry => entry.id === parentId);
      if (!parentSession || parentSession.parentSessionId) {
        console.log('Invalid parent session');
        return;
      }
  
      // Получаем полные данные родительской сессии
      const fullSession = await window.electronAPI.getPresession(parentId);
      
      // Создаем новую подсессию
      const newSession = {
        id: Date.now().toString(),
        date: fullSession.date,
        weekDay: new Date(fullSession.date).toLocaleDateString('en-US', { weekday: 'long' }),
        mindset_preparation: fullSession.mindset_preparation,
        the_zone: fullSession.the_zone,
        video_url: fullSession.video_url,
        parentSessionId: parentId,
        pair: '',
        narrative: parentSession.narrative,
        execution: '',
        outcome: '',
        plan_outcome: false,
        forex_factory_news: JSON.stringify([]),
        topDownAnalysis: JSON.stringify([]),
        plans: JSON.stringify({
          narrative: { text: '' },
          execution: { text: '' },
          outcome: { text: '' }
        }),
        chart_processes: JSON.stringify([])
      };
  
      // Сохраняем новую подсессию
      await window.electronAPI.savePresession(newSession);
      
      // Перезагружаем данные
      await loadData();
      
      // Очищаем выбор
      setSelectedEntries([]);
      
      console.log('Subsession created successfully');
    } catch (error) {
      console.error('Error creating subsession:', error);
    }
  };

  return (
    <>
      <GlobalStyle />
      <DatePickerStyles />
      <DailyRoutineContainer ref={containerRef}>
        <Header>
          <BackButton onClick={handleBack} />
          <Title>Pre-Session Analysis Journal</Title>
          <Subtitle>Let's plan your trades!</Subtitle>
        </Header>
        <JournalContent>
          <JournalHeader>
            <ButtonGroup>
              <ActionButton primary onClick={handleAdd}>
                Add new Pre-Session
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
                      <FilterLabel>Narrative</FilterLabel>
                      <FilterSelect
                        name="narrative"
                        value={filterCriteria.narrative}
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
                      <FilterLabel>Execution</FilterLabel>
                      <FilterSelect
                        name="execution"
                        value={filterCriteria.execution}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Executions</option>
                        <option value="Day off">Day off</option>
                        <option value="No Trades">No Trades</option>
                        <option value="Skipped">Skipped</option>
                        <option value="Missed">Missed</option>
                        <option value="BE">BE</option>
                        <option value="Loss">Loss</option>
                        <option value="Win">Win</option>
                      </FilterSelect>
                    </FilterGroup>

                    <FilterGroup>
                      <FilterLabel>Outcome</FilterLabel>
                      <FilterSelect
                        name="outcome"
                        value={filterCriteria.outcome}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Outcomes</option>
                        <option value="Bullish">Bullish</option>
                        <option value="Bearish">Bearish</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Day off">Day off</option>
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
                        onChange={(e) => {
                          const [field, order] = e.target.value.split('-');
                          setSortConfig({ field, order });
                        }}
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
              checked={selectedEntries.length === sortedAndFilteredEntries.length && sortedAndFilteredEntries.length > 0}
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
                            style={{ width: cell.column.width }}
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
              <p>Ви впевнені, що хочете видалити цей запис?</p>
              <PopupButton onClick={() => confirmDelete(deletePopup)}>Так</PopupButton>
              <PopupButton onClick={() => setDeletePopup(null)}>Ні</PopupButton>
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

export default PreSessionJournal;