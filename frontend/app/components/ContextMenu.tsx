import { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
}
const ContextMenu = ({ x, y, items, onClose }: ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);
  
    return (
      <div
        ref={menuRef}
        className="fixed z-50 bg-gray-800 rounded-lg shadow-lg py-1 min-w-[160px]"
        style={{ top: y, left: x }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            className="w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-2"
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    );
}

export default ContextMenu