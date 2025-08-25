import fs from "fs";
import path from "path";

// Define proper types based on contentlayer schema
export interface Note {
  title: string;
  summary: string;
  url?: string;
  pinned?: boolean;
  date: string;
  updatedAt?: string;
  image_author?: string;
  image_author_url?: string;
  image_url?: string;
  body: {
    raw: string;
    code: string;
  };
  _id: string;
  _raw: {
    sourceFilePath: string;
    sourceFileName: string;
    sourceFileDir: string;
    contentType: string;
    flattenedPath: string;
  };
  type: string;
  slug: string;
  image: string;
  og: string;
}

export interface Project {
  title: string;
  summary: string;
  longSummary?: string;
  date: string;
  url?: string;
  demoUrl?: string;
  technologies?: string[];
  pinned?: boolean;
  image_author?: string;
  image_author_url?: string;
  image_url?: string;
  body: {
    raw: string;
    code: string;
  };
  _id: string;
  _raw: {
    sourceFilePath: string;
    sourceFileName: string;
    sourceFileDir: string;
    contentType: string;
    flattenedPath: string;
  };
  type: string;
  slug: string;
  image: string;
}

// Helper function to safely read JSON files
function readJsonFile<T>(filePath: string): T[] {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Load data from the generated JSON files
export const allNotes = readJsonFile<Note>(
  ".contentlayer/generated/Note/_index.json"
);
export const allProjects = readJsonFile<Project>(
  ".contentlayer/generated/Project/_index.json"
);
