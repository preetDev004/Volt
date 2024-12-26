import { useState } from "react";
import clsx from "clsx";
import { FileOperations } from "../lib/fileOperations";
import ContextMenu from "./ContextMenu";
import { Button } from "./ui/button";

export interface FileItem {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileItem[];
}

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  selectedFile?: FileItem;
  onFileOperation: (operation: FileOperations) => void;
}
const FileExplorer = ({
  files,
  onFileSelect,
  selectedFile,
  onFileOperation,
}: FileExplorerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item?: FileItem;
  } | null>(null);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleContextMenu = (e: React.MouseEvent, item?: FileItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  const getContextMenuItems = (item?: FileItem) => {
    const items = [];

    // Add create options for root or directories
    if (!item || item.type === "directory") {
      items.push(
        {
          label: "New File",
          onClick: () =>
            onFileOperation({
              type: "create",
              path: item?.path || "/",
              fileType: "file",
            }),
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          ),
        },
        {
          label: "New Folder",
          onClick: () =>
            onFileOperation({
              type: "create",
              path: item?.path || "/",
              fileType: "directory",
            }),
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
        }
      );
    }

    // Add rename and delete options for existing items
    if (item) {
      items.push(
        {
          label: "Rename",
          onClick: () => {
            const newName = window.prompt("Enter new name:", item.name);
            if (newName && newName !== item.name) {
              onFileOperation({ type: "rename", path: item.path, newName });
            }
          },
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          ),
        },
        {
          label: "Delete",
          onClick: () => onFileOperation({ type: "delete", path: item.path }),
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          ),
        }
      );
    }

    return items;
  };

  const renderItem = (item: FileItem, depth = 0) => {
    const isExpanded = expandedFolders.has(item.path);
    const isSelected = selectedFile?.path === item.path;

    return (
      <div key={item.path} style={{ paddingLeft: `${depth * 16}px` }}>
        <Button
        tabIndex={0}
          className={clsx(
            "flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-700/50 rounded",
            isSelected && "bg-gray-700"
          )}
          onClick={() => {
            if (item.type === "directory") {
              toggleFolder(item.path);
            } else {
              onFileSelect(item);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              // Call the onClick handler when Enter or Space is pressed
              if (item.type === "directory") {
                toggleFolder(item.path);
              } else {
                onFileSelect(item);
              }
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, item)}
        >
          {item.type === "directory" ? (
            <svg
              className={clsx(
                "w-4 h-4 transition-transform",
                isExpanded ? "rotate-90" : ""
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
          <span className="text-sm text-gray-200">{item.name}</span>
        </Button>
        {item.type === "directory" && isExpanded && item.children && (
          <div>
            {item.children.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="h-full w-64 bg-gray-900 text-white overflow-y-auto relative"
      onContextMenu={(e) => handleContextMenu(e)}
    >
      <div className="p-2">
        <h2 className="text-sm font-semibold mb-2 px-2">Files</h2>
        {files.map((file) => renderItem(file))}
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getContextMenuItems(contextMenu.item)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default FileExplorer;
