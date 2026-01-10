import React from "react";

export interface ComparisonTableProps {
  features: string[];
  frameworks: {
    name: string;
    values: (string | React.ReactNode)[];
  }[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  features,
  frameworks,
}) => {
  return (
    <div className="border-secondary my-8 overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <table className="bg-primary w-full border-collapse">
          <thead>
            <tr className="bg-tertiary">
              <th className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Feature
              </th>
              {frameworks.map((framework) => (
                <th
                  key={framework.name}
                  className="border-primary text-tertiary border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  {framework.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-secondary divide-y">
            {features.map((feature, featureIndex) => (
              <tr key={feature} className="hover:bg-secondary">
                <td className="text-primary whitespace-nowrap px-6 py-4 text-sm font-medium">
                  {feature}
                </td>
                {frameworks.map((framework) => (
                  <td
                    key={`${feature}-${framework.name}`}
                    className="text-secondary px-6 py-4 text-sm"
                  >
                    {framework.values[featureIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
