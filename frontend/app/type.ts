export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  path: string;
}

export enum StepType {
  CreateFile,
  CreateFolder,
  UpdateFile,
  DeleteFile,
  RunScript,
}

export interface Step {
  id: number;
  title: string;
  type: StepType;
  code?: string;
  path?: string;
  status: "pending" | "in-progress" | "completed";
}
export interface Project {
  prompt: string;
  steps: Step[];
}

export interface WebContainerFile {
  file: {
    contents: string;
  }
}

export interface WebContainerDirectory {
  directory: {
    [key: string]: WebContainerFile | WebContainerDirectory;
  }
}

// prop types
export interface CodeEditorProps {
  file: FileItem | null;
}
export interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

export interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}
