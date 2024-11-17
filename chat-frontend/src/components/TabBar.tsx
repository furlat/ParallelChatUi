import React from 'react';
import { X } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabReorder?: (fromIndex: number, toIndex: number) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabReorder,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (onTabReorder && fromIndex !== toIndex) {
      onTabReorder(fromIndex, toIndex);
    }
  };

  return (
    <div className="flex space-x-1 overflow-x-auto flex-1 h-14 px-4 items-center scrollbar-none">
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className={`
            group flex items-center px-4 h-10
            text-sm font-medium rounded-lg cursor-pointer select-none
            min-w-[120px] max-w-[200px] border
            ${activeTabId === tab.id
              ? 'bg-white text-gray-900 border-gray-300 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-200'
            } transition-colors
          `}
          onClick={() => onTabSelect(tab.id)}
        >
          <span className="truncate flex-1">{tab.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className="ml-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-0.5 rounded-sm hover:bg-gray-100"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
