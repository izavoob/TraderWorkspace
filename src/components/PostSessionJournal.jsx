import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from 'react-table';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
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

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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

const DailyRoutineContainer = styled.div`
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
  background: linear-gradient(45deg, #7425C9, #B886EE, #7425C9);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  padding: 20px 0;
  border-radius: 10px 10px 0 0;
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
  position: relative;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
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

const EditableSelect = styled.select`
  width: 100%;
  padding: 6px;
  margin: 0;
  background: ${props => {
    switch (props.value) {
      case 'Bullish':
        return '#1a472a';
      case 'Bearish':
        return '#5c1919';
      case 'Good':
        return '#1a472a';
      case 'Bad':
        return '#5c1919';
      case 'Acceptable':
        return '#714a14';
      default:
        return '#3e3e3e';
    }
  }};
  color: ${props => {
    switch (props.value) {
      case 'Bullish':
        return '#4ade80';
      case 'Bearish':
        return '#f87171';
      case 'Good':
        return '#4ade80';
      case 'Bad':
        return '#f87171';
      case 'Acceptable':
        return '#fbbf24';
      default:
        return '#fff';
    }
  }};
  border: 1px solid #5e2ca5;
  border-radius: 4px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }

  option {
    background: #3e3e3e;
    color: #fff;
    padding: 8px;
  }
`;

const Table = styled.table`
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
`;

const TableCell = styled.td`
  border: 1px solid #5e2ca5;
  padding: 10px;
  text-align: left;
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
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  width: 100%;
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

  img {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: #fff;
  height: 40px;
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

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 6px;
  background: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 4px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const RangeDropdown = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  padding: 15px;
  z-index: 1000;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const FilterButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const FilterButton = styled.button`
  background: ${props => props.clear ? '#ff4757' : '#5C9DF5'};
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
`;

const FilterDropdown = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  padding: 15px;
  z-index: 1000;
  width: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const FilterGroup = styled.div`
  margin-bottom: 10px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #fff;
`;

const SortDropdown = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  padding: 15px;
  z-index: 1000;
  width: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const SortGroup = styled.div`
  margin-bottom: 10px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 6px;
  margin: 0;
  background: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 4px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }

  option {
    background: #3e3e3e;
    color: #fff;
    padding: 8px;
  }
`;

function PostSessionJournal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [deletePopup, setDeletePopup] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [sortConfig, setSortConfig] = useState({
    field: 'date',
    order: 'desc'
  });

  const containerRef = useRef(null);
  const filterButtonRef = useRef(null);
  const rangeButtonRef = useRef(null);
  const sortButtonRef = useRef(null);

  useEffect(() => {
    loadData();
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
    setIsLoading(true);
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const routine = await window.electronAPI.getDailyRoutine(currentDate);
      
      if (routine && routine.postSession) {
        const processedData = Array.isArray(routine.postSession) 
          ? routine.postSession.map(entry => ({
              ...entry,
              id: String(entry.id || Date.now())
            }))
          : [];
        
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
    const newRecord = {
      id: String(Date.now()),
      date: new Date().toISOString().split('T')[0],
      weekDay: new Date().toLocaleString('en-US', { weekday: 'long' }),
      pair: '',
      dayNarrative: '',
      realization: '',
      routineExecution: '',
      planOutcome: false
    };

    setData(prevData => [newRecord, ...prevData]);
    
    window.electronAPI.saveDailyRoutine({
      date: new Date().toISOString().split('T')[0],
      postSession: [...data, newRecord]
    });
  };

  const handleDelete = async (id) => {
    try {
      const updatedData = data.filter(entry => entry.id !== id);
      setData(updatedData);
      
      await window.electronAPI.saveDailyRoutine({
        date: new Date().toISOString().split('T')[0],
        postSession: updatedData
      });

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
      const updatedData = data.filter(entry => !selectedEntries.includes(entry.id));
      await window.electronAPI.saveDailyRoutine({
        date: new Date().toISOString().split('T')[0],
        postSession: updatedData
      });

      setData(updatedData);
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
              onChange={() => handleSelectEntry(row.original.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <IconButton 
              onClick={() => handleEdit(row.original.id)}
            >
              <img src={EditIcon} alt="Edit" />
            </IconButton>
            <IconButton 
              onClick={() => setDeletePopup(row.original.id)}
            >
              <img src={DeleteIcon} alt="Delete" />
            </IconButton>
          </ButtonsContainer>
        )
      },
      { Header: 'Pair', accessor: 'pair', width: 120,
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
              window.electronAPI.saveDailyRoutine({
                date: new Date().toISOString().split('T')[0],
                postSession: updatedData,
              });
            }}
          >
            <option value="">Select</option>
            <option value="EUR/USD">EUR/USD</option>
            <option value="GBP/USD">GBP/USD</option>
            <option value="USD/JPY">USD/JPY</option>
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
            onChange={(e) => {
              const updatedData = data.map(item => {
                if (item.id === row.original.id) {
                  return { ...item, dayNarrative: e.target.value };
                }
                return item;
              });
              setData(updatedData);
              window.electronAPI.saveDailyRoutine({
                date: new Date().toISOString().split('T')[0],
                postSession: updatedData,
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
        Header: 'Realization',
        accessor: 'realization',
        width: 120,
        Cell: ({ row, value }) => (
          <EditableSelect
            value={value || ''}
            onChange={(e) => {
              const updatedData = data.map(item => {
                if (item.id === row.original.id) {
                  return { ...item, realization: e.target.value };
                }
                return item;
              });
              setData(updatedData);
              window.electronAPI.saveDailyRoutine({
                date: new Date().toISOString().split('T')[0],
                postSession: updatedData,
              });
            }}
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
              const updatedData = data.map(item => {
                if (item.id === row.original.id) {
                  return { 
                    ...item, 
                    routineExecution: e.target.checked
                  };
                }
                return item;
              });
              
              setData(updatedData);
              window.electronAPI.saveDailyRoutine({
                date: new Date().toISOString().split('T')[0],
                postSession: updatedData,
              });
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
                const updatedData = data.map(item => {
                  if (item.id === row.original.id) {
                    return { 
                      ...item, 
                      planOutcome: e.target.checked
                    };
                  }
                  return item;
                });
                
                setData(updatedData);
                window.electronAPI.saveDailyRoutine({
                  date: new Date().toISOString().split('T')[0],
                  postSession: updatedData,
                });
              }}
            />
          );
        },
      },
    ],
    [data, selectedEntries]
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
              <DropdownContainer>
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
              </DropdownContainer>
              
              <DropdownContainer>
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
                        <option value="EUR/USD">EUR/USD</option>
                        <option value="GBP/USD">GBP/USD</option>
                        <option value="USD/JPY">USD/JPY</option>
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
              </DropdownContainer>

              <DropdownContainer>
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
              </DropdownContainer>
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

          <Table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <TableHeader {...column.getHeaderProps()} style={{ width: column.width }}>
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
                    No entries yet
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(row => {
                  prepareRow(row);
                  const isSelected = selectedEntries.includes(row.original.id);
                  
                  return (
                    <TableRow key={row.original.id} {...row.getRowProps()} selected={isSelected}>
                      {row.cells.map(cell => (
                        <TableCell {...cell.getCellProps()} style={{ width: cell.column.width }}>
                          {cell.render('Cell')}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </tbody>
          </Table>

          {deletePopup && (
            <Popup>
              <p>Want to delete?</p>
              <PopupButton onClick={() => handleDelete(deletePopup)}>Yes</PopupButton>
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