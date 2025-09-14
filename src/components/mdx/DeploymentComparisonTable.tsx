import React from "react";

interface DeploymentComparisonRow {
  aspect: string;
  traditional: string;
  wrapperCharts: string;
}

interface DeploymentComparisonTableProps {
  data: DeploymentComparisonRow[];
}

const DeploymentComparisonTable = ({
  data,
}: DeploymentComparisonTableProps): React.ReactElement => (
  <div className="border-secondary my-8 overflow-hidden rounded-lg">
    <div className="overflow-x-auto">
      <table className="bg-primary w-full border-collapse">
        <thead>
          <tr className="bg-tertiary">
            <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Aspect
            </th>
            <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Traditional Approach
            </th>
            <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Wrapper Charts
            </th>
          </tr>
        </thead>
        <tbody className="divide-secondary divide-y">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-secondary">
              <td className="text-primary whitespace-nowrap px-6 py-4 text-sm font-medium">
                {row.aspect}
              </td>
              <td className="text-secondary px-6 py-4 text-sm">
                {row.traditional}
              </td>
              <td className="text-secondary px-6 py-4 text-sm">
                {row.wrapperCharts}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DeploymentComparisonTable;
