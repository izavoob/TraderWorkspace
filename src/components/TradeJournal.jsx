import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable } from 'react-table';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Link } from 'react-router-dom';

// Імпортуй іконки як модулі
import EditIcon from '../assets/icons/edit-icon.svg';
import DeleteIcon from '../assets/icons/delete-icon.svg';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-color: #1a1a1a;
    overflow: hidden;
  }
`;

const TradeJournalContainer = styled.div`
  max-width: 1820px;
  margin: 20px auto;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  position: relative;
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
  margin-top: 168px;
  padding-top: 20px;
`;

const JournalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ActionButton = styled.button`
  background: ${(props) =>
    props.primary ? 'conic-gradient(from 45deg, #7425C9, #B886EE)' : '#5C9DF5'};
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  height: 40px;
  width: ${(props) => (props.primary ? '240px' : 'auto')};
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
  padding: 10px;
  text-align: left;
  color: #fff;
  background-color: #2e2e2e;
  position: relative; /* Додано для позиціонування кнопок */
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #2e2e2e;
  }
  &:nth-child(odd) {
    background-color: #3e3e3e;
  }
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
  position: relative; /* Додано для позиціонування tooltip */

  &:hover {
    transform: scale(1.1); /* Збільшення при наведенні, як у кнопки Back */
  }

  &:active {
    transform: scale(0.98); /* Зменшення при кліку, як у кнопки Back */
  }

  transition: transform 0.3s ease; /* Плавна анімація, як у кнопки Back */

  img {
    width: 16px;
    height: 16px;
  }

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%; /* Позиція над кнопкою */
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

const ButtonsContainer = styled.div`
  display: flex;
  gap: 5px; /* Зменшено відступ між кнопками для компактності */
  justify-content: center; /* Центрування кнопок у вузькій колонці */
  align-items: center; /* Вертикальне вирівнювання кнопок */
  width: 100%; /* Забезпечує адаптивну ширину для вмісту, але обмежену колонкою */
  opacity: 1; /* Кнопки завжди видимі */
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #2e2e2e;
  padding: 40px; /* Залишено збільшений padding */
  border-radius: 20px; /* Залишено збільшений border-radius */
  border: 2px solid #5e2ca5;
  color: #fff;
  z-index: 1001;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Залишено збільшену тінь */
  min-width: 400px; /* Залишено збільшену мінімальну ширину */
  min-height: 200px; /* Залишено збільшену мінімальну висоту */
`;

const PopupButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: #fff;
  border: none;
  padding: 16px 32px; /* Залишено збільшений padding */
  margin: 10px; /* Залишено збільшений margin */
  border-radius: 30px; /* Залишено збільшений border-radius */
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

function TradeJournal() {
  const [trades, setTrades] = useState([]);
  const [filter] = useState('all'); // За замовчуванням усі трейди
  const [deletePopup, setDeletePopup] = useState(null);
  const navigate = useNavigate();

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

  const filteredTrades = React.useMemo(() => {
    const now = new Date();
    return trades.filter((trade) => {
      const tradeDate = new Date(trade.date);
      if (filter === 'week') {
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        return tradeDate >= weekStart && tradeDate <= now;
      } else if (filter === 'month') {
        return (
          tradeDate.getMonth() === now.getMonth() &&
          tradeDate.getFullYear() === now.getFullYear()
        );
      } else if (filter === 'all') {
        return true;
      }
      return false;
    });
  }, [trades, filter]);

  const columns = React.useMemo(
    () => [
      { Header: 'Action', accessor: 'action', width: 20, Cell: () => null }, // Встановлено ширину, як у колонки "No." (20px)
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: filteredTrades });

  const handleTradeClick = (tradeId) => {
    navigate(`/trade/${tradeId}`);
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
      <TradeJournalContainer>
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
              <ActionButton onClick={() => setFilter('week')}>Range</ActionButton>
              <ActionButton onClick={() => setFilter('month')}>Filter</ActionButton>
            </ButtonGroup>
          </JournalHeader>
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
                  return (
                    <TableRow className="table-row" {...row.getRowProps()}>
                      {row.cells.map((cell, index) => (
                        <TableCell {...cell.getCellProps()} style={{ width: `${cell.column.width}px` }}>
                          {index === 0 ? ( // Колонка "Action" для кнопок
                            <ButtonsContainer>
                              <IconButton data-tooltip="Change your trade" onClick={() => handleEdit(row.original.id)}>
                                <img src={EditIcon} alt="Edit" />
                              </IconButton>
                              <IconButton data-tooltip="Move your trade to trash" onClick={() => setDeletePopup(row.original.id)}>
                                <img src={DeleteIcon} alt="Delete" />
                              </IconButton>
                            </ButtonsContainer>
                          ) : cell.column.Header === 'No.' ? ( // Колонка "No."
                            <Link to={`/trade/${row.original.id}`} style={{ color: '#fff', textDecoration: 'none' }}>
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
        </JournalContent>
      </TradeJournalContainer>
    </>
  );
}

export default TradeJournal;