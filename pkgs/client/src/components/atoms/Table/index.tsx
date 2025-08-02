import React from 'react';
import './Table.css';

type TableProps = {
  className?: string;
  headers: string[];
  data: Array<Record<string, React.ReactNode>>;
};

export const Table: React.FC<TableProps> = ({ className = '', headers, data }) => {
  return (
    <table className={`table ${className}`}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, colIndex) => (
              <td key={colIndex}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
