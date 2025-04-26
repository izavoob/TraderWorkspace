import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TrashContainer = styled.div`
 
  margin: 20px auto;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  color: #fff;
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

const TrashContent = styled.div`
  margin-top: 168px;
  padding-top: 20px;
`;

const TrashTable = styled.table`
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
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #2e2e2e;
  }
  &:nth-child(odd) {
    background-color: #3e3e3e;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ActionButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

function Trash() {
  const [deletedTrades, setDeletedTrades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDeletedTrades = async () => {
      try {
        const loadedTrades = await window.electronAPI.getDeletedTrades();
        setDeletedTrades(loadedTrades || []);
      } catch (error) {
        console.error('Error loading deleted trades:', error);
        setDeletedTrades([]);
      }
    };
    loadDeletedTrades();
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: 'No.', accessor: (row, i) => i + 1, width: 20 },
      { Header: 'Date', accessor: 'date', width: 129 },
      { Header: 'Pair', accessor: 'pair', width: 129 },
      { Header: 'Session', accessor: 'session', width: 110 },
      { Header: 'Direction', accessor: 'direction', width: 110 },
      { Header: 'Result', accessor: 'result', width: 110 },
      { Header: 'Category', accessor: 'tradeClass', width: 90 },
      { Header: 'Profit in %', accessor: 'profitLoss', Cell: ({ value }) => `${value}%`, width: 90 },
      { Header: 'Profit in $', accessor: 'gainedPoints', Cell: ({ value }) => `$${value}`, width: 90 },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: deletedTrades });

  const handleBack = () => {
    navigate('/settings'); // Повернення до Settings
  };

  const handleRestore = async (trade) => {
    try {
      await window.electronAPI.restoreTrade(trade);
      setDeletedTrades(deletedTrades.filter((t) => t.id !== trade.id));
    } catch (error) {
      console.error('Error restoring trade:', error);
    }
  };

  const handleDeletePermanently = async (tradeId) => {
    try {
      await window.electronAPI.deletePermanently(tradeId);
      setDeletedTrades(deletedTrades.filter((t) => t.id !== tradeId));
    } catch (error) {
      console.error('Error deleting trade permanently:', error);
    }
  };

  return (
    <TrashContainer>
      <Header>
        <BackButton onClick={handleBack} />
        <Title>Trash</Title>
      </Header>
      <TrashContent>
        <TrashTable {...getTableProps()}>
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
                  No deleted trades yet
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <TableCell {...cell.getCellProps()} style={{ width: `${cell.column.width}px` }}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </tbody>
        </TrashTable>
        {rows.length > 0 && (
          <ActionButtons>
            {rows.map((row) => (
              <div key={row.original.id} style={{ marginTop: '10px' }}>
                <ActionButton onClick={() => handleRestore(row.original)}>Restore</ActionButton>
                <ActionButton onClick={() => handleDeletePermanently(row.original.id)}>Delete Permanently</ActionButton>
              </div>
            ))}
          </ActionButtons>
        )}
      </TrashContent>
    </TrashContainer>
  );
}

export default Trash;