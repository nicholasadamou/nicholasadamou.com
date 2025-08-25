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

// Common test data factories
export const createMockPost = (overrides = {}) => ({
  title: "Test Post",
  summary: "Test summary",
  date: "2024-01-01",
  slug: "test-post",
  readingTime: { text: "5 min read", minutes: 5, time: 300000, words: 1000 },
  body: { raw: "# Test content", html: "<h1>Test content</h1>" },
  _id: "test-post.mdx",
  _raw: {
    sourceFilePath: "test-post.mdx",
    sourceFileName: "test-post.mdx",
    sourceFileDir: ".",
    contentType: "mdx",
    flattenedPath: "test-post",
  },
  type: "Note",
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  title: "Test Project",
  summary: "Test project summary",
  date: "2024-01-01",
  slug: "test-project",
  url: "https://github.com/test/project",
  technologies: ["React", "TypeScript"],
  readingTime: { text: "3 min read", minutes: 3, time: 180000, words: 600 },
  body: { raw: "# Test project", html: "<h1>Test project</h1>" },
  _id: "test-project.mdx",
  _raw: {
    sourceFilePath: "test-project.mdx",
    sourceFileName: "test-project.mdx",
    sourceFileDir: ".",
    contentType: "mdx",
    flattenedPath: "test-project",
  },
  type: "Project",
  ...overrides,
});

// Mock fetch responses
export const mockFetchResponse = (data: any, ok = true) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    })
  ) as any;
};

// Wait for async operations to complete
export const waitForPromises = () => new Promise(setImmediate);
