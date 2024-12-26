export interface FileItem {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileItem[];
  }
export type FileOperations =
  | { type: 'create'; path: string; fileType: 'file' | 'directory' }
  | { type: 'delete'; path: string }
  | { type: 'rename'; path: string; newName: string };

export function createFile(
  files: FileItem[],
  path: string,
  type: 'file' | 'directory',
  name: string
): FileItem[] {
  const newPath = path === '/' ? `/${name}` : `${path}/${name}`;
  const newFile: FileItem = {
    name,
    path: newPath,
    type,
    children: type === 'directory' ? [] : undefined,
  };

  if (path === '/') {
    return [...files, newFile];
  }

  return files.map((item) => updateFileTree(item, path, newFile));
}

export function renameFile(
  files: FileItem[],
  path: string,
  newName: string
): FileItem[] {
  return files.map((item) => {
    if (item.path === path) {
      const parentPath = path.substring(0, path.lastIndexOf('/'));
      const newPath = parentPath === '' ? `/${newName}` : `${parentPath}/${newName}`;
      return {
        ...item,
        name: newName,
        path: newPath,
        children: item.children
          ? item.children.map((child) => ({
              ...child,
              path: child.path.replace(path, newPath),
            }))
          : undefined,
      };
    }

    if (item.children) {
      return {
        ...item,
        children: renameFile(item.children, path, newName),
      };
    }

    return item;
  });
}

function updateFileTree(item: FileItem, targetPath: string, newFile: FileItem): FileItem {
  if (item.path === targetPath && item.type === 'directory') {
    return {
      ...item,
      children: [...(item.children || []), newFile],
    };
  }

  if (item.children) {
    return {
      ...item,
      children: item.children.map((child) => updateFileTree(child, targetPath, newFile)),
    };
  }

  return item;
}

export function deleteFile(files: FileItem[], path: string): FileItem[] {
  return files.filter((item) => {
    if (item.path === path) {
      return false;
    }
    if (item.children) {
      return {
        ...item,
        children: deleteFile(item.children, path),
      };
    }
    return true;
  });
}