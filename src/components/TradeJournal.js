import React, { useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table'; // Додаємо usePagination для пагінації
import { Link, useNavigate } from 'react-router-dom'; // Для переходу на сторінку трейду
import styled from 'styled-components';

const TradeJournalContainer = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  min-height: 100vh; /* Розтягуємо фон на всю висоту */
  background-color: #1a1a1a; /* Гарантуємо темний фон */
`;

const JournalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button`
  background-color: #5e2ca5;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &.active {
    background-color: #4a1a8d;
  }

  &:hover {
    background-color: #6e3cb5;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AddTradeButton = styled.button`
  background-color: #5e2ca5;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #4a1a8d;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const TradeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
`;

const TableHeader = styled.th`
  border: 1px solid #fff;
  padding: 8px;
  text-align: left;
  color: #fff;
  background-color: #3e3e3e;
`;

const TableCell = styled.td`
  border: 1px solid #fff;
  padding: 8px;
  text-align: left;
  color: #fff;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #2e2e2e;
  }

  &:nth-child(odd) {
    background-color: #3e3e3e;
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
`;

const EditInput = styled.input`
  margin-right: 10px;
  padding: 5px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 4px;
  flex: 1;
  min-width: 200px;
`;

const EditTextarea = styled.textarea`
  margin-right: 10px;
  padding: 5px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 4px;
  flex: 1;
  min-width: 200px;
  min-height: 80px;
  resize: vertical;
`;

const ActionButton = styled.button`
  background-color: #5e2ca5;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #4a1a8d;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;

  &:hover {
    background-color: #c0392b;
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

  // Колонки для таблиці
  const columns = React.useMemo(
    () => [
      { Header: 'No.', accessor: (row, i) => i + 1 }, // Порядковий номер
      { Header: 'Date', accessor: 'date' },
      { Header: 'Asset', accessor: 'asset' },
      { Header: 'Account', accessor: 'account' },
      { Header: 'Pair', accessor: 'pair' },
      { Header: 'Session', accessor: 'session' },
      { Header: 'Direction', accessor: 'direction' },
      { Header: 'Result', accessor: 'result' },
      { Header: 'Position Size', accessor: 'positionSize' },
      { Header: 'Gained Points', accessor: 'gainedPoints' },
      { Header: 'Trade Class', accessor: 'tradeClass' },
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
    <TradeJournalContainer>
      <JournalHeader>
        <FilterButtons>
          <FilterButton onClick={() => setFilter('week')} className={filter === 'week' ? 'active' : ''}>
            This Week
          </FilterButton>
          <FilterButton onClick={() => setFilter('month')} className={filter === 'month' ? 'active' : ''}>
            This Month
          </FilterButton>
          <FilterButton onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
            All Trades
          </FilterButton>
        </FilterButtons>
        <AddTradeButton onClick={handleAddTrade}>
          Add Trade
        </AddTradeButton>
      </JournalHeader>
      {editingTradeId && (
        <TradeEditForm onSubmit={handleSaveEdit}>
          <EditInput
            type="text"
            name="asset"
            value={editedTrade.asset}
            onChange={(e) => setEditedTrade({ ...editedTrade, asset: e.target.value })}
            placeholder="Asset (e.g., BTC/USD)"
          />
          <EditInput
            type="number"
            name="entryPrice"
            value={editedTrade.entryPrice}
            onChange={(e) => setEditedTrade({ ...editedTrade, entryPrice: e.target.value })}
            placeholder="Entry Price"
          />
          <EditInput
            type="number"
            name="exitPrice"
            value={editedTrade.exitPrice}
            onChange={(e) => setEditedTrade({ ...editedTrade, exitPrice: e.target.value })}
            placeholder="Exit Price"
          />
          <EditInput
            type="number"
            name="profitLoss"
            value={editedTrade.profitLoss}
            onChange={(e) => setEditedTrade({ ...editedTrade, profitLoss: e.target.value })}
            placeholder="Profit/Loss"
          />
          <EditInput
            type="text"
            name="tradeName"
            value={editedTrade.tradeName}
            onChange={(e) => setEditedTrade({ ...editedTrade, tradeName: e.target.value })}
            placeholder="Trade Name"
          />
          <EditInput
            type="text"
            name="account"
            value={editedTrade.account}
            onChange={(e) => setEditedTrade({ ...editedTrade, account: e.target.value })}
            placeholder="Account"
          />
          <EditInput
            type="text"
            name="pair"
            value={editedTrade.pair}
            onChange={(e) => setEditedTrade({ ...editedTrade, pair: e.target.value })}
            placeholder="Pair"
          />
          <EditInput
            type="text"
            name="session"
            value={editedTrade.session}
            onChange={(e) => setEditedTrade({ ...editedTrade, session: e.target.value })}
            placeholder="Session"
          />
          <EditInput
            type="text"
            name="direction"
            value={editedTrade.direction}
            onChange={(e) => setEditedTrade({ ...editedTrade, direction: e.target.value })}
            placeholder="Direction"
          />
          <EditInput
            type="text"
            name="result"
            value={editedTrade.result}
            onChange={(e) => setEditedTrade({ ...editedTrade, result: e.target.value })}
            placeholder="Result"
          />
          <EditInput
            type="number"
            name="positionSize"
            value={editedTrade.positionSize}
            onChange={(e) => setEditedTrade({ ...editedTrade, positionSize: e.target.value })}
            placeholder="Position Size"
          />
          <EditInput
            type="number"
            name="gainedPoints"
            value={editedTrade.gainedPoints}
            onChange={(e) => setEditedTrade({ ...editedTrade, gainedPoints: e.target.value })}
            placeholder="Gained Points"
          />
          <EditInput
            type="text"
            name="tradeClass"
            value={editedTrade.tradeClass}
            onChange={(e) => setEditedTrade({ ...editedTrade, tradeClass: e.target.value })}
            placeholder="Trade Class"
          />
          <EditTextarea
            name="notes"
            value={editedTrade.notes}
            onChange={(e) => setEditedTrade({ ...editedTrade, notes: e.target.value })}
            placeholder="Notes"
          />
          <ActionButton type="submit">Save Changes</ActionButton>
          <ActionButton type="button" onClick={handleCancelEdit}>
            Cancel
          </ActionButton>
          <DeleteButton type="button" onClick={() => handleDelete(editingTradeId)}>
            Delete
          </DeleteButton>
        </TradeEditForm>
      )}
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
                    <ActionButton onClick={() => handleEdit(row.original)} className="edit-button">
                      Edit
                    </ActionButton>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </tbody>
      </TradeTable>
    </TradeJournalContainer>
  );
}

export default TradeJournal;