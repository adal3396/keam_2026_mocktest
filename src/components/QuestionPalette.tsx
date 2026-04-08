import React from 'react';
import { Question, QuestionStatus } from '../types';

interface Props {
  questions: Question[];
  currentIdx: number;
  answers: Record<string, number>;
  markedForReview: Set<string>;
  visited: Set<string>;
  activeSubject?: string;
  onQuestionClick: (idx: number) => void;
}

const getStatus = (
  q: Question,
  answers: Record<string, number>,
  markedForReview: Set<string>,
  visited: Set<string>
): QuestionStatus => {
  const answered = answers[q.id] !== undefined;
  const marked = markedForReview.has(q.id);
  const vis = visited.has(q.id);

  if (!vis) return 'not-visited';
  if (answered && marked) return 'answered-marked';
  if (marked) return 'marked';
  if (answered) return 'answered';
  return 'not-answered';
};

const statusStyle = (status: QuestionStatus): string => {
  switch (status) {
    case 'not-visited': return 'bg-gray-400 text-white';
    case 'not-answered': return 'bg-red-500 text-white';
    case 'answered': return 'bg-green-500 text-white';
    case 'marked': return 'bg-purple-600 text-white';
    case 'answered-marked': return 'bg-purple-600 text-white ring-2 ring-green-400';
    default: return 'bg-gray-400 text-white';
  }
};

export const QuestionPalette: React.FC<Props> = ({
  questions,
  currentIdx,
  answers,
  markedForReview,
  visited,
  onQuestionClick,
}) => {
  const subjectGroups = [
    { label: 'Mathematics', short: 'Math', color: 'bg-blue-700', questions: questions.filter(q => q.subject === 'Mathematics') },
    { label: 'Physics', short: 'Phy', color: 'bg-green-700', questions: questions.filter(q => q.subject === 'Physics') },
    { label: 'Chemistry', short: 'Chem', color: 'bg-orange-600', questions: questions.filter(q => q.subject === 'Chemistry') },
  ];

  // Count stats
  const answered = Object.keys(answers).length;
  const notAnswered = [...visited].filter(id => answers[id] === undefined).length;
  const notVisited = questions.length - visited.size;
  const marked = [...markedForReview].filter(id => answers[id] === undefined).length;
  const answeredMarked = [...markedForReview].filter(id => answers[id] !== undefined).length;

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-300">
      {/* Header */}
      <div className="bg-[#1565c0] text-white px-3 py-2 text-sm font-semibold text-center">
        Question Palette
      </div>

      {/* Stats summary */}
      <div className="px-2 py-2 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-500 flex-shrink-0"></div>
            <span>Answered: <strong>{answered}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-red-500 flex-shrink-0"></div>
            <span>Not Answered: <strong>{notAnswered}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-gray-400 flex-shrink-0"></div>
            <span>Not Visited: <strong>{notVisited}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-purple-600 flex-shrink-0"></div>
            <span>Marked: <strong>{marked + answeredMarked}</strong></span>
          </div>
        </div>
      </div>

      {/* Question buttons by section */}
      <div className="flex-1 overflow-y-auto">
        {subjectGroups.map(group => (
          <div key={group.label}>
            <div className={`${group.color} text-white text-xs font-semibold px-3 py-1.5`}>
              {group.label} ({group.questions.length} Questions)
            </div>
            <div className="p-2 flex flex-wrap gap-1.5">
              {group.questions.map((q) => {
                const globalIdx = questions.findIndex(qq => qq.id === q.id);
                const status = getStatus(q, answers, markedForReview, visited);
                const isCurrent = globalIdx === currentIdx;

                return (
                  <button
                    key={q.id}
                    onClick={() => onQuestionClick(globalIdx)}
                    className={`w-8 h-8 rounded text-xs font-bold transition-all flex items-center justify-center
                      ${statusStyle(status)}
                      ${isCurrent ? 'ring-2 ring-yellow-400 ring-offset-1 scale-110 z-10' : 'hover:scale-105'}
                      ${status === 'answered-marked' ? 'relative' : ''}
                    `}
                    title={`Q${q.questionNo} — ${status.replace(/-/g, ' ')}`}
                  >
                    {q.questionNo}
                    {status === 'answered-marked' && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full text-[8px] flex items-center justify-center text-white">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 px-2 py-2 bg-gray-50">
        <div className="text-xs font-semibold text-gray-600 mb-1.5">Legend:</div>
        <div className="space-y-1">
          {[
            { color: 'bg-gray-400', label: 'Not Visited' },
            { color: 'bg-red-500', label: 'Not Answered' },
            { color: 'bg-green-500', label: 'Answered' },
            { color: 'bg-purple-600', label: 'Marked for Review' },
            { color: 'bg-purple-600 ring-2 ring-green-400', label: 'Ans. & Marked' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-4 h-4 rounded flex-shrink-0 ${item.color}`}></div>
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
