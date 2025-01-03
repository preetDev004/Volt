import { FileItem, WebContainerDirectory, WebContainerFile } from "../type";

export const mountStructure = (files: FileItem[]) => {
    // Initialize the root structure
    const webContainerStructure: Record<string, WebContainerDirectory | WebContainerFile> = {};
    const processItem = (item: FileItem, parentPath: string[] = []): WebContainerFile | WebContainerDirectory => {
      if (item.type === 'file') {
        return {
          file: {
            contents: item.content || ''
          }
        };
      } else {
        // For folders, create a directory entry and process all children
        const directoryContents: Record<string, WebContainerFile | WebContainerDirectory> = {};
        
        if (item.children) {
          item.children.forEach(child => {
            directoryContents[child.name] = processItem(child, [...parentPath, item.name]);
          });
        }
  
        return {
          directory: directoryContents
        };
      }
    };
  
    // Process each root-level item
    files.forEach(file => {
      if (file.type === 'folder') {
        webContainerStructure[file.name] = processItem(file) as WebContainerDirectory;
      } else {
        // If it's a root-level file, we need to wrap it in a parent directory
        webContainerStructure[file.name.split('/')[0]] = {
          file: {
            contents: file.content || ''
          }
        };
      }
    });
  
    return webContainerStructure;
  };