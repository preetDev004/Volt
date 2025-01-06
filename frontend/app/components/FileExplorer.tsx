import { FolderTree, File, ChevronRight, ChevronDown } from "lucide-react";
import { FileExplorerProps, FileNodeProps } from "../type";
import { useState } from "react";
import { Button } from "./ui/button";

function FileNode({isSelected, item, depth, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="select-none">
      <Button
        className={`flex w-full p-2 ${isSelected?.path === item.path ? "bg-purple-700/60 hover:bg-purple-700/60" : "bg-transparent hover:bg-zinc-600"}  cursor-pointer`}
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        <p className="w-full flex items-center gap-2 px-2">
          {item.type === "folder" && (
            <span className="text-gray-300">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 " />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
          {item.type === "folder" ? (
            <FolderTree className="w-4 h-4 text-purple-500" />
          ) : (
            <File className="w-4 h-4 text-gray-300 " />
          )}
          <span className="text-gray-200 font-normal">{item.name}</span>
        </p>
      </Button>
      {item.type === "folder" && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              isSelected={isSelected}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({selectedFile, files, onFileSelect }: FileExplorerProps) {
  return (
    <div className="bg-black-1 shadow-lg py-4 px-2 h-full overflow-auto">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-200">
        <FolderTree className="w-5 h-5" />
        <span>Files</span>
      </h2>
      <div className="space-y-1">
        {files.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onFileClick={onFileSelect}
            isSelected={selectedFile}
          />
        ))}
      </div>
    </div>
  );
}
