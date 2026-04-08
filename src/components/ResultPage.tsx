import React from 'react';
import { Question, StudentInfo } from '../types';
import { SubmitResult } from '../lib/examApi';

interface Props {
  questions: Question[];
  answers: Record<string, number>;
  student: StudentInfo;
  timeTaken: number;
  onRetry: () => void;
  serverResult?: SubmitResult | null;
}

export const ResultPage: React.FC<Props> = ({ questions, answers, student, timeTaken, onRetry, serverResult }) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;

  const calcSubject = (subj: string) => {
    const qs = questions.filter(q => q.subject === subj);
    let correct = 0, wrong = 0, unattempted = 0, score = 0;
    qs.forEach(q => {
      const ans = answers[q.id];
      if (ans === undefined) { unattempted++; }
      else if (ans === q.correctOption) { correct++; score += 4; }
      else { wrong++; score -= 1; }
    });
    return { total: qs.length, correct, wrong, unattempted, score };
  };

  const mathStats = calcSubject('Mathematics');
  const physStats = calcSubject('Physics');
  const chemStats = calcSubject('Chemistry');

  const localTotalCorrect = mathStats.correct + physStats.correct + chemStats.correct;
  const localTotalWrong = mathStats.wrong + physStats.wrong + chemStats.wrong;
  const localTotalUnattempted = mathStats.unattempted + physStats.unattempted + chemStats.unattempted;
  const localTotalScore = mathStats.score + physStats.score + chemStats.score;
  const localMaxScore = questions.length * 4;
  const totalCorrect = serverResult?.correct ?? localTotalCorrect;
  const totalWrong = serverResult?.wrong ?? localTotalWrong;
  const totalUnattempted = serverResult?.unattempted ?? localTotalUnattempted;
  const totalScore = serverResult?.totalScore ?? localTotalScore;
  const maxScore = serverResult?.maxScore ?? localMaxScore;
  const percentage = ((totalScore / maxScore) * 100).toFixed(2);
  const accuracy = totalCorrect + totalWrong > 0
    ? ((totalCorrect / (totalCorrect + totalWrong)) * 100).toFixed(1)
    : '0.0';

  const subjectData = [
    { name: 'Mathematics', ...mathStats, max: 75 * 4, color: 'blue' },
    { name: 'Physics', ...physStats, max: 45 * 4, color: 'green' },
    { name: 'Chemistry', ...chemStats, max: 30 * 4, color: 'orange' },
  ];

  const scoreRank = totalScore >= 500 ? 'Excellent' : totalScore >= 400 ? 'Very Good' : totalScore >= 300 ? 'Good' : totalScore >= 200 ? 'Average' : 'Needs Improvement';
  const rankColor = totalScore >= 500 ? 'text-green-600' : totalScore >= 400 ? 'text-blue-600' : totalScore >= 300 ? 'text-yellow-600' : totalScore >= 200 ? 'text-orange-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#1a237e] text-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1a237e] font-black text-xs">CEE</span>
            </div>
            <div>
              <div className="text-xs opacity-70">KEAM 2025 — Mock Test Result</div>
              <div className="font-bold">Commissioner for Entrance Examinations, Kerala</div>
            </div>
          </div>
          <button
            onClick={onRetry}
            className="bg-white text-[#1a237e] font-bold text-sm px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            🔄 Take Another Test
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5 space-y-4">
        {/* Scorecard */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#1565c0] to-[#0d47a1] text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-80 mb-1">Score Report</div>
                <div className="text-3xl font-black">{totalScore} <span className="text-lg font-normal opacity-80">/ {maxScore}</span></div>
                <div className={`text-sm font-semibold mt-1 ${rankColor.replace('text-', 'text-')} bg-white/20 inline-block px-2 py-0.5 rounded`}>
                  {scoreRank}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black">{percentage}%</div>
                <div className="text-xs opacity-80">Percentile Score</div>
              </div>
            </div>
          </div>

          {/* Student info */}
          <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div><span className="text-gray-500">Name:</span> <strong>{student.name}</strong></div>
              <div><span className="text-gray-500">Roll No:</span> <strong>{student.rollNo}</strong></div>
              <div><span className="text-gray-500">Application No:</span> <strong>{student.applicationNo}</strong></div>
              <div><span className="text-gray-500">Time Taken:</span> <strong>{pad(mins)}:{pad(secs)} min</strong></div>
            </div>
          </div>

          {/* Overall stats grid */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center bg-green-50 border border-green-200 rounded p-3">
              <div className="text-2xl font-black text-green-600">{totalCorrect}</div>
              <div className="text-xs text-gray-600 mt-0.5">Correct</div>
              <div className="text-xs text-green-600 font-semibold">+{totalCorrect * 4} marks</div>
            </div>
            <div className="text-center bg-red-50 border border-red-200 rounded p-3">
              <div className="text-2xl font-black text-red-600">{totalWrong}</div>
              <div className="text-xs text-gray-600 mt-0.5">Wrong</div>
              <div className="text-xs text-red-600 font-semibold">-{totalWrong} marks</div>
            </div>
            <div className="text-center bg-gray-50 border border-gray-200 rounded p-3">
              <div className="text-2xl font-black text-gray-500">{totalUnattempted}</div>
              <div className="text-xs text-gray-600 mt-0.5">Unattempted</div>
              <div className="text-xs text-gray-500 font-semibold">0 marks</div>
            </div>
            <div className="text-center bg-blue-50 border border-blue-200 rounded p-3">
              <div className="text-2xl font-black text-blue-600">{accuracy}%</div>
              <div className="text-xs text-gray-600 mt-0.5">Accuracy</div>
              <div className="text-xs text-blue-600 font-semibold">of attempted Qs</div>
            </div>
          </div>
        </div>

        {/* Subject-wise breakdown */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-[#1565c0] text-white px-4 py-2 font-semibold text-sm">
            Section-wise Performance
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Section</th>
                  <th className="text-center px-3 py-3">Questions</th>
                  <th className="text-center px-3 py-3">Attempted</th>
                  <th className="text-center px-3 py-3 text-green-600">Correct</th>
                  <th className="text-center px-3 py-3 text-red-600">Wrong</th>
                  <th className="text-center px-3 py-3 text-gray-500">Skipped</th>
                  <th className="text-center px-3 py-3">Score</th>
                  <th className="text-center px-3 py-3">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {subjectData.map((s, i) => {
                  const acc = s.correct + s.wrong > 0 ? ((s.correct / (s.correct + s.wrong)) * 100).toFixed(1) : '—';
                  const barWidth = Math.max(0, (s.score / s.max) * 100);
                  return (
                    <tr key={s.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-semibold text-gray-800">{s.name}</td>
                      <td className="text-center px-3 py-3">{s.total}</td>
                      <td className="text-center px-3 py-3">{s.correct + s.wrong}</td>
                      <td className="text-center px-3 py-3 text-green-600 font-semibold">{s.correct}</td>
                      <td className="text-center px-3 py-3 text-red-600 font-semibold">{s.wrong}</td>
                      <td className="text-center px-3 py-3 text-gray-500">{s.unattempted}</td>
                      <td className="text-center px-3 py-3">
                        <span className={`font-bold ${s.score >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {s.score} / {s.max}
                        </span>
                        <div className="mt-1 h-1.5 bg-gray-200 rounded-full w-20 mx-auto">
                          <div
                            className={`h-full rounded-full ${s.color === 'blue' ? 'bg-blue-500' : s.color === 'green' ? 'bg-green-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.max(0, barWidth)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="text-center px-3 py-3 text-gray-700">{acc}%</td>
                    </tr>
                  );
                })}
                <tr className="bg-blue-50 font-bold border-t-2 border-blue-300">
                  <td className="px-4 py-3 text-blue-900">Total</td>
                  <td className="text-center px-3 py-3">{questions.length}</td>
                  <td className="text-center px-3 py-3">{totalCorrect + totalWrong}</td>
                  <td className="text-center px-3 py-3 text-green-700">{totalCorrect}</td>
                  <td className="text-center px-3 py-3 text-red-700">{totalWrong}</td>
                  <td className="text-center px-3 py-3 text-gray-500">{totalUnattempted}</td>
                  <td className="text-center px-3 py-3 text-blue-900">{totalScore} / {maxScore}</td>
                  <td className="text-center px-3 py-3 text-blue-900">{accuracy}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Answer Key */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-[#1565c0] text-white px-4 py-2 font-semibold text-sm flex items-center justify-between">
            <span>Detailed Answer Key</span>
            <span className="text-xs opacity-80">{questions.length} Questions</span>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-100">
                <tr className="text-gray-600 font-semibold uppercase tracking-wide">
                  <th className="text-left px-3 py-2">Q No.</th>
                  <th className="text-left px-3 py-2">Section</th>
                  <th className="text-center px-3 py-2">Your Answer</th>
                  <th className="text-center px-3 py-2">Correct</th>
                  <th className="text-center px-3 py-2">Status</th>
                  <th className="text-center px-3 py-2">Marks</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, i) => {
                  const OPTIONS = ['A', 'B', 'C', 'D', 'E'];
                  const ans = answers[q.id];
                  const isCorrect = ans === q.correctOption;
                  const isUnattempted = ans === undefined;
                  const marks = isUnattempted ? 0 : isCorrect ? 4 : -1;

                  return (
                    <tr key={q.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-1.5 font-semibold">{q.questionNo}</td>
                      <td className="px-3 py-1.5 text-gray-600">{q.subject.slice(0, 4)}.</td>
                      <td className="text-center px-3 py-1.5">
                        {isUnattempted ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {OPTIONS[ans]}
                          </span>
                        )}
                      </td>
                      <td className="text-center px-3 py-1.5 font-bold text-green-600">
                        {OPTIONS[q.correctOption]}
                      </td>
                      <td className="text-center px-3 py-1.5">
                        {isUnattempted ? (
                          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs">Skipped</span>
                        ) : isCorrect ? (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">✓ Correct</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">✗ Wrong</span>
                        )}
                      </td>
                      <td className={`text-center px-3 py-1.5 font-bold ${marks > 0 ? 'text-green-600' : marks < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {marks > 0 ? '+' : ''}{marks}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-500 pb-4">
          This is a computer-generated result of the KEAM 2025 Mock Test. &nbsp;|&nbsp; Commissioner for Entrance Examinations, Kerala &nbsp;|&nbsp; www.cee.kerala.gov.in
        </div>
      </div>
    </div>
  );
};
