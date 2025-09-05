import React from "react";

interface MetricsRow {
  metric: string;
  traditional: string;
  environmentLevel: string;
  perAppSelective: string;
}

interface MetricsTableProps {
  data: MetricsRow[];
}

const MetricsTable = ({ data }: MetricsTableProps): React.ReactElement => (
  <div className="border-secondary my-8 overflow-hidden rounded-lg">
    <div className="overflow-x-auto">
      <table className="bg-primary w-full border-collapse">
        <thead>
          <tr className="bg-tertiary">
            <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Metric
            </th>
            <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Traditional
            </th>
            <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Environment-Level
            </th>
            <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Per-App Selective
            </th>
          </tr>
        </thead>
        <tbody className="divide-secondary divide-y">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-secondary">
              <td className="text-primary whitespace-nowrap px-6 py-4 text-sm font-medium">
                {row.metric}
              </td>
              <td className="text-secondary px-6 py-4 text-sm">
                {row.traditional}
              </td>
              <td className="text-secondary px-6 py-4 text-sm">
                {row.environmentLevel}
              </td>
              <td className="text-secondary px-6 py-4 text-sm">
                {row.perAppSelective}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default MetricsTable;
