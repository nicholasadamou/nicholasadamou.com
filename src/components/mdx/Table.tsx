interface Column {
  key: string;
  header: string;
}

interface TableProps {
  columns: Column[];
  data: Record<string, string>[];
}

export function Table({ columns, data }: TableProps) {
  if (!columns || !data) return null;

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border-current/10 border-b px-4 py-2 text-left font-medium"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="border-current/5 border-b px-4 py-2"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
