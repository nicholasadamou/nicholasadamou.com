// Re-export everything from the new MDX utility functions
// This maintains compatibility with existing imports
export {
  getAllNotes,
  getAllProjects,
  getNoteBySlug,
  getProjectBySlug,
  getPinnedNotes,
  getPinnedProjects,
  getAllNoteSlugs,
  getAllProjectSlugs,
  type Note,
  type Project,
  type BaseContent,
} from "./mdx";

// Create the allNotes and allProjects exports for backward compatibility
import { getAllNotes, getAllProjects } from "./mdx";

export const allNotes = getAllNotes();
export const allProjects = getAllProjects();
