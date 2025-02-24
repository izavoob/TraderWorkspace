import React, { useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table'; // Додаємо usePagination для пагінації
import { Link, useNavigate } from 'react-router-dom'; // Для переходу на сторінку трейду
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';

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
  max-width: 1200px;
  margin: 20px auto;
  min-height: 100vh;
  background-color: #1a1a1a; /* Темний фон, як на фото */
  padding: 20px;
`;

const Header = styled.header`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  padding: 20px 0; /* Змінено padding, щоб кнопка займала всю висоту */
  border-radius: 10px 10px 0 0; /* Заокруглення верхніх кутів, як на фото */
  color: #fff;
  position: fixed; /* Фіксуємо заголовок зверху, як у Home */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Щоб був поверх інших елементів */
  height: 128px; /* Фіксована висота, як у Home */
  min-height: 6.67vh; /* Адаптивність для менших екранів */
  max-height: 128px; /* Обмеження максимальної висоти */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center; /* Вирівнювання контенту по вертикалі */
`;

const BackButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE); /* Той самий градієнт, що й у Header, для злиття */
  border: none;
  padding: 0;
  width: 200px; /* Збільшено ширину в 2 рази (з 100px до 200px) */
  height: 100%; /* Висота на всю висоту Header */
  border-radius: 0; /* Без заокруглень, щоб злитися з фоном */
  cursor: pointer;
  position: absolute; /* Фіксуємо кнопку в лівому краї */
  left: 0;
  top: 0;
  opacity: 0; /* Початкова прозорість для кнопки (невидима) */
  transition: all 0.3s ease; /* Анімація для плавного переходу */

  &:hover {
    opacity: 1; /* Повна видимість при наведенні */
    transform: scale(1.1); /* Збільшення кнопки при наведенні */
  }

  &:active {
    transform: scale(0.98); /* Легке стиснення при кліку */
  }

  &:before {
    content: 'Back'; /* Текст "Back" як псевдоелемент */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2em;
    color: rgba(255, 255, 255, 0); /* Початкова невидимість тексту */
    transition: color 0.3s ease; /* Анімація для тексту */
  }

  &:hover:before {
    color: #fff; /* Висвітлення тексту при наведенні */
  }
`;

const Title = styled.h1` /* Змінено на h1 для відповідності розміру "Good Evening!" */
  margin: 0 auto; /* Центрування тексту посередині, незалежно від кнопки */
  font-size: 2.5em; /* Той самий розмір, як у Greeting у Home */
  color: #fff;
  text-align: center; /* Центрування тексту заголовка */
  z-index: 1; /* Щоб текст був поверх кнопки */
`;

const JournalContent = styled.div`
  margin-top: 168px; /* Зсув вниз, враховуючи висоту Header (128px) + padding 20px, як у Home */
  padding-top: 20px; /* Додатковий відступ для контенту під заголовком */
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
  align-items: center; /* Вирівнювання по центру вертикально */
`;

const ActionButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 15px; /* Заокруглені кнопки, як на фото */
  cursor: pointer;
  font-size: 16px;
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
  background-color: #2e2e2e; /* Темний фон таблиці */
  border: 2px solid #5e2ca5; /* Фіолетова обводка, як на фото */
`;

const TableHeader = styled.th`
  background: conic-gradient(from 45deg, #7425C9, #B886EE); /* Фіолетовий градієнт для заголовків */
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
  background-color: #2e2e2e; /* Темний фон для клітинок */
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #2e2e2e;
  }

  &:nth-child(odd) {
    background-color: #3e3e3e; /* Трохи світліший фон для непарних рядків */
  }
`;

const TradeEditForm = styled.form`
  background-color: #2e2e2e;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  border: 2px solid #5e2ca5; /* Фіолетова обводка для форми */
`;

const EditInput = styled.input`
  margin-right: 10px;
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  flex: 1;
  min-width: 200px;
`;

const EditTextarea = styled.textarea`
  margin-right: 10px;
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  flex: 1;
  min-width: 200px;
  min-height: 80px;
  resize: vertical;
`;

const EditActionButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const DeleteButton = styled(EditActionButton)`
  background: conic-gradient(from 45deg, #e74c3c, #c0392b); /* Червоний градієнт для кнопки видалення */

  &:hover {
    background: conic-gradient(from 45deg, #c0392b, #a93226);
  }
`;

function TradeJournal() {
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState('week'); // За замовчуванням — трейди цього тижня
  const [editingTradeId, setEditingTradeId] = useState(null); // ID трейду, який редагуємо
  const [editedTrade, setEditedTrade] = useState({
    asset: '',
    entryPrice: '',
    exitPrice: '',
    profitLoss: '',
    notes: '',
    tradeName: '',
    account: '',
    pair: '',
    session: '',
    direction: '',
    result: '',
    positionSize: '',
    gainedPoints: '',
    tradeClass: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrades = async () => {
      try {
        const loadedTrades = await window.electronAPI.getTrades();
        setTrades(loadedTrades || []);
      } catch (error) {
        console.error('Error loading trades:', error);
        setTrades([]); // Установлюємо порожній масив навіть при помилці
      }
    };
    loadTrades();
  }, []);

  // Фільтрація трейдів
  const filteredTrades = React.useMemo(() => {
    const now = new Date();
    return trades.filter((trade) => {
      const tradeDate = new Date(trade.date);
      if (filter === 'week') {
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        return tradeDate >= weekStart && tradeDate <= now;
      } else if (filter === 'month') {
        return tradeDate.getMonth() === now.getMonth() && tradeDate.getFullYear() === now.getFullYear();
      } else if (filter === 'all') {
        return true;
      }
      return false;
    });
  }, [trades, filter]);

  // Колонки для таблиці (оновлено для відповідності дизайну)
  const columns = React.useMemo(
    () => [
      { Header: 'No.', accessor: (row, i) => i + 1 },
      { Header: 'Date', accessor: 'date' },
      { Header: 'Pair', accessor: 'pair' },
      { Header: 'Session', accessor: 'session' },
      { Header: 'Direction', accessor: 'direction' },
      { Header: 'Result', accessor: 'result' },
      { Header: 'Category', accessor: 'tradeClass' }, // Змінено з 'Trade Class' на 'Category' для відповідності фото
      { Header: 'Profit in %', accessor: 'profitLoss', Cell: ({ value }) => `${value}%` }, // Форматування для відсотків
      { Header: 'Profit in $', accessor: 'gainedPoints', Cell: ({ value }) => `$${value}` }, // Форматування для доларів
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredTrades }, usePagination);

  // Обробка кліку на номер трейду для переходу на сторінку
  const handleTradeClick = (tradeId) => {
    navigate(`/trade/${tradeId}`); // Перехід на сторінку трейду
  };

  // Перехід на сторінку створення трейду
  const handleAddTrade = () => {
    navigate('/create-trade'); // Перехід на сторінку створення трейду
  };

  // Обробка кліку на кнопку "Back"
  const handleBack = () => {
    navigate(-1); // Повернення на попередню сторінку
  };

  // Початок редагування трейду
  const handleEdit = (trade) => {
    setEditingTradeId(trade.id);
    setEditedTrade({
      asset: trade.asset || '',
      entryPrice: trade.entryPrice || '',
      exitPrice: trade.exitPrice || '',
      profitLoss: trade.profitLoss || '',
      notes: trade.notes || '',
      tradeName: trade.tradeName || '',
      account: trade.account || '',
      pair: trade.pair || '',
      session: trade.session || '',
      direction: trade.direction || '',
      result: trade.result || '',
      positionSize: trade.positionSize || '',
      gainedPoints: trade.gainedPoints || '',
      tradeClass: trade.tradeClass || '',
    });
  };

  // Збереження змін у трейді
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (editingTradeId) {
      const updatedTrade = {
        id: editingTradeId,
        date: trades.find((t) => t.id === editingTradeId)?.date || new Date().toISOString().split('T')[0],
        ...editedTrade,
      };
      try {
        await window.electronAPI.updateTrade(editingTradeId, updatedTrade);
        setTrades(trades.map((trade) => (trade.id === editingTradeId ? updatedTrade : trade)));
        setEditingTradeId(null);
        setEditedTrade({
          asset: '',
          entryPrice: '',
          exitPrice: '',
          profitLoss: '',
          notes: '',
          tradeName: '',
          account: '',
          pair: '',
          session: '',
          direction: '',
          result: '',
          positionSize: '',
          gainedPoints: '',
          tradeClass: '',
        });
      } catch (error) {
        console.error('Error updating trade:', error);
      }
    }
  };

  // Скасування редагування
  const handleCancelEdit = () => {
    setEditingTradeId(null);
    setEditedTrade({
      asset: '',
      entryPrice: '',
      exitPrice: '',
      profitLoss: '',
      notes: '',
      tradeName: '',
      account: '',
      pair: '',
      session: '',
      direction: '',
      result: '',
      positionSize: '',
      gainedPoints: '',
      tradeClass: '',
    });
  };

  // Видалення трейду
  const handleDelete = async (tradeId) => {
    try {
      await window.electronAPI.deleteTrade(tradeId);
      setTrades(trades.filter((trade) => trade.id !== tradeId));
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
              <ActionButton onClick={handleAddTrade}>Add new Trade</ActionButton>
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
                    <TableHeader {...column.getHeaderProps()}>{column.render('Header')}</TableHeader>
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
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        if (cell.column.Header === 'No.') {
                          return (
                            <TableCell {...cell.getCellProps()}>
                              <Link to={`/trade/${row.original.id}`} style={{ color: '#fff', textDecoration: 'none' }}>
                                {cell.render('Cell')}
                              </Link>
                            </TableCell>
                          );
                        }
                        return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>;
                      })}
                      <TableCell>
                        <EditActionButton onClick={() => handleEdit(row.original)}>
                          Edit
                        </EditActionButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </tbody>
          </TradeTable>
          {editingTradeId && (
            <TradeEditForm onSubmit={handleSaveEdit}>
              <EditInput
                type="text"
                name="pair"
                value={editedTrade.pair}
                onChange={(e) => setEditedTrade({ ...editedTrade, pair: e.target.value })}
                placeholder="Pair (e.g., EURUSD)"
              />
              <EditInput
                type="text"
                name="session"
                value={editedTrade.session}
                onChange={(e) => setEditedTrade({ ...editedTrade, session: e.target.value })}
                placeholder="Session (e.g., London)"
              />
              <EditInput
                type="text"
                name="direction"
                value={editedTrade.direction}
                onChange={(e) => setEditedTrade({ ...editedTrade, direction: e.target.value })}
                placeholder="Direction (e.g., Long/Short)"
              />
              <EditInput
                type="text"
                name="result"
                value={editedTrade.result}
                onChange={(e) => setEditedTrade({ ...editedTrade, result: e.target.value })}
                placeholder="Result (e.g., Win/Lose)"
              />
              <EditInput
                type="text"
                name="tradeClass"
                value={editedTrade.tradeClass}
                onChange={(e) => setEditedTrade({ ...editedTrade, tradeClass: e.target.value })}
                placeholder="Category (e.g., B)"
              />
              <EditInput
                type="number"
                name="profitLoss"
                value={editedTrade.profitLoss}
                onChange={(e) => setEditedTrade({ ...editedTrade, profitLoss: e.target.value })}
                placeholder="Profit in %"
              />
              <EditInput
                type="number"
                name="gainedPoints"
                value={editedTrade.gainedPoints}
                onChange={(e) => setEditedTrade({ ...editedTrade, gainedPoints: e.target.value })}
                placeholder="Profit in $"
              />
              <EditInput
                type="date"
                name="date"
                value={editedTrade.date || new Date().toISOString().split('T')[0]}
                onChange={(e) => setEditedTrade({ ...editedTrade, date: e.target.value })}
              />
              <EditTextarea
                name="notes"
                value={editedTrade.notes}
                onChange={(e) => setEditedTrade({ ...editedTrade, notes: e.target.value })}
                placeholder="Notes"
              />
              <EditActionButton type="submit">Save Changes</EditActionButton>
              <EditActionButton type="button" onClick={handleCancelEdit}>
                Cancel
              </EditActionButton>
              <DeleteButton type="button" onClick={() => handleDelete(editingTradeId)}>
                Delete
              </DeleteButton>
            </TradeEditForm>
          )}
        </JournalContent>
      </TradeJournalContainer>
    </>
  );
}

export default TradeJournal;