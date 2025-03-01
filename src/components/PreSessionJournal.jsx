import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { useTable, usePagination } from 'react-table';
import EditIcon from '../assets/icons/edit-icon.svg';
import DeleteIcon from '../assets/icons/delete-icon.svg';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
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
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
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

const RoutineContent = styled.div`
  margin-top: 148px;
  padding-top: 20px;
  position: relative;
  min-height: calc(100vh - 168px);
  width: 100%;
  overflow-y: visible;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  z-index: 999;
  min-height: 50px;
  flex-direction: row;
  width: 100%;
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

const FullSessionButton = styled(ActionButton)`
  margin-top: 20px;
  width: 100%;
  background: linear-gradient(45deg, #2C5364, #203A43, #0F2027);
  &:hover {
    background: linear-gradient(45deg, #203A43, #0F2027, #2C5364);
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
  transition: transform 0.2s ease, opacity 0.2s ease;
  padding: 5px;
  
  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }

  img {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
`;

const Th = styled.th`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border: 1px solid #5e2ca5;
  padding: 12px;
  text-align: left;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const Td = styled.td`
  border: 1px solid #5e2ca5;
  padding: 10px;
  text-align: left;
  color: #fff;
  background-color: #2e2e2e;
  position: relative;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #2e2e2e;
  }
  &:nth-child(odd) {
    background-color: #3e3e3e;
  }
`;

const Select = styled.select`
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

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalContent = styled.div`
  background: #2e2e2e;
  padding: 30px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  width: 90%;
  max-width: 600px;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: white;
  font-size: 14px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;

const StyledOption = styled.option`
  background: ${props => {
    switch (props.value) {
      case 'Bullish':
        return '#1a472a';
      case 'Bearish':
        return '#5c1919';
      case 'Win':
        return '#1a472a';
      case 'Loss':
        return '#5c1919';
      case 'BE':
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
      case 'Win':
        return '#4ade80';
      case 'Loss':
        return '#f87171';
      case 'BE':
        return '#fbbf24';
      default:
        return '#fff';
    }
  }};
`;

const StyledSelect = styled(Select)`
  & option {
    padding: 8px;
  }

  color: ${props => {
    switch (props.value) {
      case 'Bullish':
        return '#4ade80';
      case 'Bearish':
        return '#f87171';
      case 'Win':
        return '#4ade80';
      case 'Loss':
        return '#f87171';
      case 'BE':
        return '#fbbf24';
      default:
        return '#fff';
    }
  }};
`;

const Checkbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #5e2ca5;
  border-radius: 4px;
  background-color: #2e2e2e;
  cursor: pointer;
  position: relative;
  margin: 0 auto;
  display: block;

  &:checked {
    background: conic-gradient(from 45deg, #7425C9, #B886EE);
    &:after {
      content: '✓';
      position: absolute;
      color: white;
      font-size: 14px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &:hover {
    border-color: #B886EE;
  }
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  p {
    color: #fff;
    margin-bottom: 20px;
  }
`;

const PopupButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin: 0 10px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

function PreSessionJournal() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [deletePopup, setDeletePopup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [newEntry, setNewEntry] = useState({
    id: null,
    date: new Date().toISOString().split('T')[0],
    weekDay: new Date().toLocaleString('en-US', { weekday: 'long' }),
    pair: '',
    narrative: '',
    execution: '',
    outcome: '',
    planOutcome: false,
    addPair: false,
  });

  const handleChange = (field, value, rowId = null) => {
    if (rowId !== null) {
      setData(prevData => prevData.map(item =>
        item.id === rowId ? { ...item, [field]: value } : item
      ));
    } else {
      setNewEntry(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFullSession = (entry = null) => {
    const sessionData = entry || {
      ...newEntry,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      weekDay: new Date().toLocaleString('en-US', { weekday: 'long' }),
    };
    navigate('/pre-session-full', { state: { sessionData } });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Actions',
        accessor: 'actions',
        width: 100,
        Cell: ({ row }) => (
          <ButtonsContainer>
            <IconButton
              data-tooltip="Edit entry"
              onClick={() => handleFullSession(row.original)}
            >
              <img src={EditIcon} alt="Edit" />
            </IconButton>
            <IconButton
              data-tooltip="Delete entry"
              onClick={() => setDeletePopup(row.original.id)}
            >
              <img src={DeleteIcon} alt="Delete" />
            </IconButton>
          </ButtonsContainer>
        ),
      },
      { Header: 'Date', accessor: 'date', width: 120 },
      { Header: 'WeekDay', accessor: 'weekDay', width: 120 },
      {
        Header: 'Pair',
        accessor: 'pair',
        width: 120,
        Cell: ({ row, value }) => (
          <StyledSelect 
            value={value || ''}
            onChange={(e) => handleChange('pair', e.target.value, row.original.id)}
          >
            <StyledOption value="">Select</StyledOption>
            <StyledOption value="EUR/USD">EUR/USD</StyledOption>
            <StyledOption value="GBP/USD">GBP/USD</StyledOption>
            <StyledOption value="USD/JPY">USD/JPY</StyledOption>
          </StyledSelect>
        ),
      },
      {
        Header: 'Narrative',
        accessor: 'narrative',
        width: 120,
        Cell: ({ row, value }) => (
          <StyledSelect 
            value={value || ''}
            onChange={(e) => handleChange('narrative', e.target.value, row.original.id)}
          >
            <StyledOption value="">Select</StyledOption>
            <StyledOption value="Bullish">Bullish</StyledOption>
            <StyledOption value="Bearish">Bearish</StyledOption>
            <StyledOption value="Neutral">Neutral</StyledOption>
            <StyledOption value="Day off">Day off</StyledOption>
          </StyledSelect>
        ),
      },
      {
        Header: 'Execution',
        accessor: 'execution',
        width: 120,
        Cell: ({ row, value }) => (
          <StyledSelect 
            value={value || ''}
            onChange={(e) => handleChange('execution', e.target.value, row.original.id)}
          >
            <StyledOption value="">Select</StyledOption>
            <StyledOption value="Day off">Day off</StyledOption>
            <StyledOption value="No Trades">No Trades</StyledOption>
            <StyledOption value="Skipped">Skipped</StyledOption>
            <StyledOption value="Missed">Missed</StyledOption>
            <StyledOption value="BE">BE</StyledOption>
            <StyledOption value="Loss">Loss</StyledOption>
            <StyledOption value="Win">Win</StyledOption>
          </StyledSelect>
        ),
      },
      {
        Header: 'Outcome',
        accessor: 'outcome',
        width: 120,
        Cell: ({ row, value }) => (
          <StyledSelect 
            value={value || ''}
            onChange={(e) => handleChange('outcome', e.target.value, row.original.id)}
          >
            <StyledOption value="">Select</StyledOption>
            <StyledOption value="Bullish">Bullish</StyledOption>
            <StyledOption value="Bearish">Bearish</StyledOption>
            <StyledOption value="Neutral">Neutral</StyledOption>
            <StyledOption value="Day off">Day off</StyledOption>
          </StyledSelect>
        ),
      },
      {
        Header: 'Plan&Outcome',
        accessor: 'planOutcome',
        width: 120,
        Cell: ({ row, value }) => (
          <Checkbox
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleChange('planOutcome', e.target.checked, row.original.id)}
          />
        ),
      },
      {
        Header: 'Add. Pair',
        accessor: 'addPair',
        width: 120,
        Cell: ({ row, value }) => (
          <Checkbox
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleChange('addPair', e.target.checked, row.original.id)}
          />
        ),
      },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const routine = await window.electronAPI.getDailyRoutine(newEntry.date);
        const preSessionData = routine.preSession || [];
        setData(preSessionData);
      } catch (error) {
        console.error('Error fetching pre-session data:', error);
        setData([]);
      }
    };
    fetchData();
  }, [newEntry.date]);

  const handleAdd = async () => {
    try {
      const newRecord = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        weekDay: new Date().toLocaleString('en-US', { weekday: 'long' }),
        pair: '',
        narrative: '',
        execution: '',
        outcome: '',
        planOutcome: false,
        addPair: false
      };

      const updatedData = [...data, newRecord];
      setData(updatedData);
      await window.electronAPI.saveDailyRoutine({
        date: newRecord.date,
        preSession: updatedData,
        postSession: [],
        emotions: [],
        notes: [],
      });

      setIsModalOpen(false);
      setNewEntry(newRecord);
    } catch (error) {
      console.error('Error adding pre-session entry:', error);
      alert('Failed to add Pre-Session entry.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedData = data.filter(entry => entry.id !== id);
      setData(updatedData);
      
      await window.electronAPI.saveDailyRoutine({
        date: newEntry.date,
        preSession: updatedData,
        postSession: [],
        emotions: [],
        notes: [],
      });
      
      setDeletePopup(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry.');
    }
  };

  const handleBack = () => {
    navigate('/daily-routine');
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, usePagination);

  return (
    <>
      <GlobalStyle />
      <DailyRoutineContainer>
        <Header>
          <BackButton onClick={handleBack} />
          <Title>Pre-Session Analysis Journal</Title>
        </Header>
        <RoutineContent>
          <ButtonContainer>
            <ActionButton primary onClick={handleAdd}>
              Add new Pre-Session
            </ActionButton>
            <div style={{ display: 'flex', gap: '10px' }}>
              <ActionButton>Range</ActionButton>
              <ActionButton>Filter</ActionButton>
            </div>
          </ButtonContainer>
          <Table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <Th {...column.getHeaderProps()} style={{ width: column.width }}>
                      {column.render('Header')}
                    </Th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <Td {...cell.getCellProps()} style={{ width: cell.column.width }}>
                        {cell.render('Cell')}
                      </Td>
                    ))}
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        </RoutineContent>

        {isModalOpen && (
          <Modal>
            <ModalContent>
              <ModalTitle>Pre-Session Options</ModalTitle>
              <ModalButtons>
                <PopupButton onClick={() => handleAdd()}>Quick Add</PopupButton>
                <PopupButton onClick={() => handleFullSession()}>Full Pre-Session</PopupButton>
                <PopupButton onClick={() => setIsModalOpen(false)}>Cancel</PopupButton>
              </ModalButtons>
            </ModalContent>
          </Modal>
        )}

        {deletePopup && (
          <Popup>
            <p>Want to delete?</p>
            <PopupButton onClick={() => handleDelete(deletePopup)}>Yes</PopupButton>
            <PopupButton onClick={() => setDeletePopup(null)}>No</PopupButton>
          </Popup>
        )}
      </DailyRoutineContainer>
    </>
  );
}

export default PreSessionJournal;