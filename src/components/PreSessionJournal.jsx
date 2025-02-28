import React, { useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DailyRoutineContainer = styled.div`
  max-width: 1820px;
  margin: 20px auto;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  overflow-x: hidden; /* Прибираємо горизонтальний скролінг */
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
    content: "Back";
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
  overflow-x: hidden; /* Прибираємо горизонтальний скролінг */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE); /* Совпадает с Header */
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Как в Header */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Как в Header */
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.05);
    background: conic-gradient(from 45deg, #B886EE, #7425C9); /* Изменяем градиент для эффекта */
  }
  &:active {
    transform: scale(0.95);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #1a1a1a; /* Темный фон, как основной */
  border-radius: 5px; /* Лёгкое скругление */
`;

const Th = styled.th`
  background: conic-gradient(from 45deg, #7425C9, #B886EE); /* Индивидуальный градиент для каждого заголовка */
  color: #fff;
  padding: 10px;
  text-align: left;
  border: 1px solid #fff; /* Белая граница для контраста */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Как в Header */
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #fff; /* Белая граница для контраста */
  background-color: #1a1a1a; /* Темный фон для ячеек, чтобы сохранить контраст */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* Лёгкая тень для читаемости */
`;

const Select = styled.select`
  background-color: #1a1a1a;
  color: #fff;
  border: 1px solid #fff; /* Белая граница для контраста */
  padding: 5px;
  border-radius: 3px;
  &:focus {
    outline: none;
    border-color: #B886EE; /* Фиолетовый акцент при фокусе */
  }
`;

const Checkbox = styled.input`
  background-color: #1a1a1a;
  border: 1px solid #fff; /* Белая граница для контраста */
`;

function PreSessionJournal() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0], // 2025-02-27
    weekDay: new Date().toLocaleString('en-US', { weekday: 'long' }), // Monday
    pair: '',
    narrative: '',
    execution: '',
    outcome: '',
    planOutcome: false,
    addPair: false,
  });

  const columns = React.useMemo(
    () => [
      { Header: 'Date', accessor: 'date' },
      { Header: 'WeekDay', accessor: 'weekDay' },
      {
        Header: 'Pair',
        accessor: 'pair',
        Cell: ({ value }) => (
          <Select value={value || ''} onChange={(e) => handleChange('pair', e.target.value)}>
            <option value="">Select</option>
            <option value="EUR/USD">EUR/USD</option>
            <option value="GBP/USD">GBP/USD</option>
            <option value="USD/JPY">USD/JPY</option>
          </Select>
        ),
      },
      {
        Header: 'Narrative',
        accessor: 'narrative',
        Cell: ({ value }) => (
          <Select value={value || ''} onChange={(e) => handleChange('narrative', e.target.value)}>
            <option value="">Select</option>
            <option value="Bullish">Bullish</option>
            <option value="Bearish">Bearish</option>
            <option value="Neutral">Neutral</option>
          </Select>
        ),
      },
      {
        Header: 'Execution',
        accessor: 'execution',
        Cell: ({ value }) => (
          <Select value={value || ''} onChange={(e) => handleChange('execution', e.target.value)}>
            <option value="">Select</option>
            <option value="Manual">Manual</option>
            <option value="Automated">Automated</option>
          </Select>
        ),
      },
      {
        Header: 'Outcome',
        accessor: 'outcome',
        Cell: ({ value }) => (
          <Select value={value || ''} onChange={(e) => handleChange('outcome', e.target.value)}>
            <option value="">Select</option>
            <option value="Profit">Profit</option>
            <option value="Loss">Loss</option>
            <option value="Break Even">Break Even</option>
          </Select>
        ),
      },
      {
        Header: 'Plan&Outcome',
        accessor: 'planOutcome',
        Cell: ({ value }) => (
          <Checkbox
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleChange('planOutcome', e.target.checked)}
          />
        ),
      },
      {
        Header: 'Add. Pair',
        accessor: 'addPair',
        Cell: ({ value }) => (
          <Checkbox
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleChange('addPair', e.target.checked)}
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
        // Убедимся, что данные — это массив объектов с нужными полями
        const normalizedData = Array.isArray(preSessionData)
          ? preSessionData.map(item => ({
              date: item.date || newEntry.date,
              weekDay: item.weekDay || newEntry.weekDay,
              pair: item.pair || '',
              narrative: item.narrative || '',
              execution: item.execution || '',
              outcome: item.outcome || '',
              planOutcome: item.planOutcome || false,
              addPair: item.addPair || false,
            }))
          : [];
        setData(normalizedData);
      } catch (error) {
        console.error('Error fetching pre-session data:', error);
        setData([]); // Устанавливаем пустой массив в случае ошибки
      }
    };
    fetchData();
  }, [newEntry.date]);

  const handleChange = (field, value) => {
    setNewEntry(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Boolean(value),
    }));
  };

  const handleAdd = async () => {
    try {
      const updatedData = [...data, { ...newEntry }]; // Создаём копию, чтобы избежать мутации
      setData(updatedData);
      await window.electronAPI.saveDailyRoutine({
        date: newEntry.date,
        preSession: updatedData,
        postSession: [],
        emotions: [],
        notes: [],
      });
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        weekDay: new Date().toLocaleString('en-US', { weekday: 'long' }),
        pair: '',
        narrative: '',
        execution: '',
        outcome: '',
        planOutcome: false,
        addPair: false,
      });
      alert('Pre-Session entry added successfully!');
    } catch (error) {
      console.error('Error adding pre-session entry:', error);
      alert('Failed to add Pre-Session entry.');
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
    <DailyRoutineContainer>
      <Header>
        <BackButton onClick={handleBack} />
        <Title>Pre-Session Analysis Journal</Title>
      </Header>
      <RoutineContent>
        <ButtonContainer>
          <ActionButton onClick={handleAdd}>Add new Pre-Session</ActionButton>
          <div>
            <ActionButton style={{ marginRight: '10px' }}>Range</ActionButton>
            <ActionButton>Filter</ActionButton>
          </div>
        </ButtonContainer>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <Td colSpan={columns.length}>No data available</Td>
              </tr>
            )}
            {/* Добавляем строку для новой записи */}
            <tr>
              {columns.map(column => (
                <Td key={column.accessor}>
                  {column.accessor === 'date' ? newEntry.date :
                   column.accessor === 'weekDay' ? newEntry.weekDay :
                   column.Cell ? (
                     column.Cell({ value: newEntry[column.accessor] })
                   ) : newEntry[column.accessor] || ''}
                </Td>
              ))}
            </tr>
          </tbody>
        </Table>
      </RoutineContent>
    </DailyRoutineContainer>
  );
}

export default PreSessionJournal;