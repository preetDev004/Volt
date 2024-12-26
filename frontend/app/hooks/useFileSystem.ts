import { useState } from "react";
import {
  FileItem,
  createFile,
  deleteFile,
  renameFile,
} from "../lib/fileOperations";

const initialFiles: FileItem[] = [
  {
    name: "src",
    path: "/src",
    type: "directory",
    children: [
      {
        name: "App.tsx",
        path: "/src/App.tsx",
        type: "file",
      },
      {
        name: "main.tsx",
        path: "/src/main.tsx",
        type: "file",
      },
    ],
  },
];

const initialFileContents: Record<string, string> = {
  "/src/App.tsx":
    "export default function App() {\n  return <div>Hello World</div>;\n}",
  "/src/main.tsx":
    'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\n\nReactDOM.createRoot(document.getElementById("root")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);',
};

export function useFileSystem() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<FileItem>();
  const [fileContents, setFileContents] =
    useState<Record<string, string>>(initialFileContents);

  const handleCreateFile = (
    path: string,
    fileType: "file" | "directory",
    name: string
  ) => {
    const updatedFiles = createFile(files, path, fileType, name);
    setFiles(updatedFiles);

    if (fileType === "file") {
      const newPath = path === "/" ? `/${name}` : `${path}/${name}`;
      setFileContents((prev) => ({
        ...prev,
        [newPath]: "",
      }));
    }
  };

  const handleDeleteFile = (path: string) => {
    const updatedFiles = deleteFile(files, path);
    setFiles(updatedFiles);

    if (selectedFile?.path === path) {
      setSelectedFile(undefined);
    }

    setFileContents((prev) => {
      const newContents = { ...prev };
      delete newContents[path];
      return newContents;
    });
  };

  const handleRenameFile = (path: string, newName: string) => {
    const updatedFiles = renameFile(files, path, newName);
    setFiles(updatedFiles);

    if (selectedFile?.path === path) {
      const parentPath = path.substring(0, path.lastIndexOf("/"));
      const newPath =
        parentPath === "" ? `/${newName}` : `${parentPath}/${newName}`;
      setSelectedFile({
        ...selectedFile,
        name: newName,
        path: newPath,
      });
    }

    if (fileContents[path]) {
      const parentPath = path.substring(0, path.lastIndexOf("/"));
      const newPath =
        parentPath === "" ? `/${newName}` : `${parentPath}/${newName}`;
      setFileContents((prev) => {
        const newContents = { ...prev };
        newContents[newPath] = newContents[path];
        delete newContents[path];
        return newContents;
      });
    }
  };

  const handleUpdateContent = (path: string, content: string) => {
    setFileContents((prev) => ({
      ...prev,
      [path]: content,
    }));
  };

  return {
    files,
    selectedFile,
    fileContents,
    setSelectedFile,
    handleCreateFile,
    handleDeleteFile,
    handleRenameFile,
    handleUpdateContent,
  };
}
