import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { ThemeProvider } from "next-themes";

// Mock the theme provider for testing
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <MockThemeProvider>{children}</MockThemeProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
