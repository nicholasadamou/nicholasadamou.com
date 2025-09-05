import React from "react";

interface ComparisonRow {
  approach: string;
  syncBehavior: string;
  resourceUsage: string;
  debuggingPrecision: string;
}

interface ComparisonTableProps {
  data: ComparisonRow[];
}

const ComparisonTable = ({
  data,
}: ComparisonTableProps): React.ReactElement => (
  <div className="border-secondary my-8 overflow-hidden rounded-lg">
    <div className="overflow-x-auto">
      <table className="bg-primary w-full border-collapse">
        <thead>
          <tr className="bg-tertiary">
            <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Approach
            </th>
            <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Sync Behavior
            </th>
            <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Resource Usage
            </th>
            <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Debugging Precision
            </th>
          </tr>
        </thead>
        <tbody className="divide-secondary divide-y">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-secondary">
              <td className="text-primary whitespace-nowrap px-6 py-4 text-sm font-medium">
                {row.approach}
              </td>
              <td className="text-secondary px-6 py-4 text-sm">
                {row.syncBehavior}
              </td>
              <td className="text-secondary px-6 py-4 text-sm">
                {row.resourceUsage}
              </td>
              <td className="text-secondary px-6 py-4 text-sm">
                {row.debuggingPrecision}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ComparisonTable;
