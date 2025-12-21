import React from "react";

export interface TableColumn<
  T extends Record<string, React.ReactNode | string>,
> {
  key: keyof T | string;
  header: string;
}

export interface TableProps<
  T extends Record<string, React.ReactNode | string>,
> {
  columns: TableColumn<T>[];
  data: T[];
}

const Table = <T extends Record<string, React.ReactNode | string>>({
  columns,
  data,
}: TableProps<T>): React.ReactElement => (
  <div className="border-secondary my-8 overflow-hidden rounded-lg">
    <div className="overflow-x-auto">
      <table className="bg-primary w-full border-collapse">
        <thead>
          <tr className="bg-tertiary">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-secondary divide-y">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-secondary">
              {columns.map((col, colIndex) => (
                <td
                  key={`${rowIndex}-${String(col.key)}-${colIndex}`}
                  className={`${colIndex === 0 ? "text-primary whitespace-nowrap font-medium" : "text-secondary"} px-6 py-4 text-sm`}
                >
                  {row[col.key as keyof typeof row] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Table;
