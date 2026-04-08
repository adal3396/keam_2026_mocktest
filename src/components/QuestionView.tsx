import React from 'react';
import { Question } from '../types';

interface Props {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: number | undefined;
  isMarked: boolean;
  onSelectOption: (optIdx: number) => void;
  onSaveNext: () => void;
  onMarkReviewNext: () => void;
  onClearResponse: () => void;
  onPrevious: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

const subjectColor: Record<string, string> = {
  Mathematics: 'bg-blue-700',
  Physics: 'bg-green-700',
  Chemistry: 'bg-orange-600',
};

export const QuestionView: React.FC<Props> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  isMarked,
  onSelectOption,
  onSaveNext,
  onMarkReviewNext,
  onClearResponse,
  onPrevious,
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Question number bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <span className={`${subjectColor[question.subject]} text-white text-xs font-bold px-3 py-1 rounded`}>
            {question.subject}
          </span>
          <span className="text-sm font-semibold text-gray-700">
            Question No. {question.questionNo} of {totalQuestions}
          </span>
        </div>
        {isMarked && (
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded font-semibold">
            🔖 Marked for Review
          </span>
        )}
      </div>

      {/* Question text */}
      <div className="px-5 py-4 border-b border-gray-200 min-h-[100px]">
        <p className="text-[15px] text-gray-900 leading-relaxed font-medium">{question.questionText}</p>
      </div>

      {/* Options */}
      <div className="flex-1 px-5 py-3 overflow-y-auto">
        <div className="space-y-2">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <label
                key={idx}
                className={`flex items-start gap-3 p-3 border-2 rounded cursor-pointer transition-all
                  ${isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                onClick={() => onSelectOption(idx)}
              >
                {/* Radio circle */}
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                  ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>

                {/* Option label */}
                <span className={`font-bold text-sm flex-shrink-0 w-5 ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                  {OPTION_LABELS[idx]}.
                </span>

                {/* Option text */}
                <span className={`text-sm leading-relaxed ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-800'}`}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-300 px-4 py-3 bg-gray-50">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left side buttons */}
          <div className="flex gap-2">
            <button
              onClick={onMarkReviewNext}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-2 rounded transition-colors"
            >
              🔖 Mark for Review & Next
            </button>
            <button
              onClick={onClearResponse}
              disabled={selectedOption === undefined}
              className={`text-xs font-semibold px-3 py-2 rounded border transition-colors ${
                selectedOption !== undefined
                  ? 'border-gray-400 text-gray-700 hover:bg-gray-100'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              ✕ Clear Response
            </button>
          </div>

          {/* Right side nav buttons */}
          <div className="flex gap-2">
            <button
              onClick={onPrevious}
              disabled={questionIndex === 0}
              className={`text-xs font-semibold px-4 py-2 rounded border transition-colors ${
                questionIndex > 0
                  ? 'bg-white border-gray-400 text-gray-700 hover:bg-gray-100'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              ◀ Previous
            </button>
            <button
              onClick={onSaveNext}
              className="bg-[#1565c0] hover:bg-[#0d47a1] text-white text-xs font-bold px-5 py-2 rounded transition-colors shadow"
            >
              Save & Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
