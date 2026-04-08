import React from 'react';
import { Subject } from '../types';

interface Props {
  activeSubject: Subject | 'All';
  onSubjectChange: (s: Subject | 'All') => void;
  counts: Record<Subject, number>;
}

export const SectionTabs: React.FC<Props> = ({ activeSubject, onSubjectChange, counts }) => {
  const tabs: Array<{ key: Subject | 'All'; label: string; color: string; activeColor: string }> = [
    { key: 'All', label: 'All Sections', color: 'bg-gray-200 text-gray-700', activeColor: 'bg-gray-700 text-white' },
    { key: 'Mathematics', label: `Mathematics (${counts.Mathematics})`, color: 'bg-blue-100 text-blue-800', activeColor: 'bg-blue-700 text-white' },
    { key: 'Physics', label: `Physics (${counts.Physics})`, color: 'bg-green-100 text-green-800', activeColor: 'bg-green-700 text-white' },
    { key: 'Chemistry', label: `Chemistry (${counts.Chemistry})`, color: 'bg-orange-100 text-orange-800', activeColor: 'bg-orange-600 text-white' },
  ];

  return (
    <div className="flex border-b border-gray-300 bg-gray-50 overflow-x-auto flex-shrink-0">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onSubjectChange(tab.key)}
          className={`px-4 py-2 text-xs font-semibold border-r border-gray-300 whitespace-nowrap transition-colors
            ${activeSubject === tab.key ? tab.activeColor : tab.color + ' hover:opacity-80'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
