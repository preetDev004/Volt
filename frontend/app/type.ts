
export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  path: string;
}

export enum StepType {
  CreateFolder,
  CreateFile,
  UpdateFile,
  DeleteFile,
  RunScript,
  Message
}

export interface Step {
  title: string;
  type: StepType;
  code?: string;
  path?: string;
  status: "pending" | "in-progress" | "completed";
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
  selectedFile: FileItem | null;
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

export interface FileNodeProps {
  isSelected: FileItem | null;
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}
