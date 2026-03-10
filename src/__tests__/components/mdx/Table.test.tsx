import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table } from "@/components/mdx/Table";

const COLUMNS = [
  { key: "name", header: "Name" },
  { key: "value", header: "Value" },
];

const DATA = [
  { name: "A", value: "1" },
  { name: "B", value: "2" },
];

describe("Table", () => {
  it("renders headers and rows", () => {
    render(<Table columns={COLUMNS} data={DATA} />);

    expect(screen.getByText("Name")).toBeDefined();
    expect(screen.getByText("Value")).toBeDefined();
    expect(screen.getByText("A")).toBeDefined();
    expect(screen.getByText("1")).toBeDefined();
    expect(screen.getByText("B")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
  });

  it("returns null when columns is undefined", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { container } = render(
      <Table columns={undefined as any} data={DATA} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("returns null when data is undefined", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { container } = render(
      <Table columns={COLUMNS} data={undefined as any} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders correct number of rows", () => {
    const { container } = render(<Table columns={COLUMNS} data={DATA} />);
    const rows = container.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(2);
  });
});
