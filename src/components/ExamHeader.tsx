import React from 'react';
import { StudentInfo } from '../types';

interface Props {
  student: StudentInfo;
  timeLeft: number;
  onSubmit: () => void;
}

export const ExamHeader: React.FC<Props> = ({ student, timeLeft, onSubmit }) => {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft <= 600; // last 10 minutes
  const isCritical = timeLeft <= 120; // last 2 minutes

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-[#1a237e] text-white shadow-md">
      {/* Top strip */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#1a237e] font-black text-xs">CEE</span>
          </div>
          <div className="leading-tight">
            <div className="text-xs opacity-70">Commissioner for Entrance Examinations, Kerala</div>
            <div className="font-bold text-sm">KEAM 2025 — Mock Test (CBT Mode)</div>
          </div>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded border-2 ${
          isCritical ? 'border-red-400 bg-red-900 animate-pulse' :
          isWarning ? 'border-yellow-400 bg-blue-900' :
          'border-blue-400 bg-blue-800'
        }`}>
          <span className="text-xs opacity-80">Time Left:</span>
          <span className={`font-mono font-bold text-lg tabular-nums ${
            isCritical ? 'text-red-300' : isWarning ? 'text-yellow-300' : 'text-white'
          }`}>
            {pad(hours)}:{pad(minutes)}:{pad(seconds)}
          </span>
        </div>
      </div>

      {/* Candidate info strip */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#0d47a1]">
        <div className="flex items-center gap-4 text-xs">
          <span><span className="opacity-70">Candidate: </span><strong>{student.name}</strong></span>
          <span className="opacity-50">|</span>
          <span><span className="opacity-70">Roll No: </span><strong>{student.rollNo}</strong></span>
          <span className="opacity-50">|</span>
          <span><span className="opacity-70">Application No: </span><strong>{student.applicationNo}</strong></span>
        </div>
        <button
          onClick={onSubmit}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-1.5 rounded border border-red-400 transition-colors"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
};
