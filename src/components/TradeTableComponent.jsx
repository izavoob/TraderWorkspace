import React from 'react';
import { useTable } from 'react-table';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #2e2e2e;
  }
  &:nth-child(odd) {
    background-color: #3e3e3e;
  }
`;

function TradeTableComponent({ columns, data, onRowClick }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
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
                {row.cells.map((cell) => (
                  <TableCell {...cell.getCellProps()} style={{ width: `${cell.column.width}px` }}>
                    {cell.column.Header === 'No.' ? (
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
  );
}

export default TradeTableComponent;