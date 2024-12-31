import { FileOperations } from "./lib/fileOperations";

export interface FileItem {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileItem[];
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

// prop types
export interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  selectedFile?: FileItem;
  onFileOperation: (operation: FileOperations) => void;
}
export interface CodeEditorProps {
  file?: FileItem;
  content: string;
  onChange: (value: string) => void;
}
