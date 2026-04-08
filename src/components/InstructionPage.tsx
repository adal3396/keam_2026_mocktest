import React, { useState } from 'react';
import { StudentInfo } from '../types';

interface Props {
  onStart: (student: StudentInfo) => void;
}

export const InstructionPage: React.FC<Props> = ({ onStart }) => {
  const [agreed, setAgreed] = useState(false);
  const [student, setStudent] = useState<StudentInfo>({
    name: '',
    rollNo: '',
    applicationNo: '',
    examCenter: 'Government Engineering College, Thrissur',
    dob: '',
  });
  const [errors, setErrors] = useState<Partial<StudentInfo>>({});

  const validate = () => {
    const newErrors: Partial<StudentInfo> = {};
    if (!student.name.trim()) newErrors.name = 'Required';
    if (!student.rollNo.trim()) newErrors.rollNo = 'Required';
    if (!student.applicationNo.trim()) newErrors.applicationNo = 'Required';
    if (!student.dob.trim()) newErrors.dob = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStart = () => {
    if (!agreed) {
      alert('Please read and agree to the instructions before proceeding.');
      return;
    }
    if (!validate()) return;
    onStart(student);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <div className="bg-[#1a237e] text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1a237e] font-black text-sm">CEE</span>
            </div>
            <div>
              <div className="text-xs opacity-80">Commissioner for Entrance Examinations</div>
              <div className="font-bold text-sm">Government of Kerala</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-80">KEAM 2025</div>
            <div className="font-bold text-sm">Kerala Engineering Architecture & Medical</div>
          </div>
        </div>
      </div>

      {/* Blue gradient banner */}
      <div className="bg-gradient-to-r from-[#1565c0] to-[#0d47a1] text-white py-3 px-4 text-center">
        <h1 className="text-lg font-bold tracking-wide">KEAM 2025 — MOCK TEST (Computer Based Test)</h1>
        <p className="text-xs opacity-80 mt-0.5">Engineering Entrance Examination | Commissioner for Entrance Examinations, Kerala</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Candidate Details Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-300 rounded shadow-sm">
              <div className="bg-[#1565c0] text-white px-4 py-2 rounded-t">
                <h2 className="font-semibold text-sm">Candidate Details</h2>
              </div>
              <div className="p-4 space-y-3">
                {/* Photo placeholder */}
                <div className="flex justify-center mb-2">
                  <div className="w-24 h-28 border-2 border-gray-400 bg-gray-100 flex items-center justify-center rounded">
                    <div className="text-center">
                      <div className="text-3xl">👤</div>
                      <div className="text-xs text-gray-500 mt-1">Photo</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Candidate Name *</label>
                  <input
                    type="text"
                    value={student.name}
                    onChange={e => setStudent(s => ({ ...s, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    value={student.rollNo}
                    onChange={e => setStudent(s => ({ ...s, rollNo: e.target.value }))}
                    placeholder="e.g. KEAM25001234"
                    className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 ${errors.rollNo ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.rollNo && <p className="text-red-500 text-xs mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Application No. *</label>
                  <input
                    type="text"
                    value={student.applicationNo}
                    onChange={e => setStudent(s => ({ ...s, applicationNo: e.target.value }))}
                    placeholder="e.g. AP25000001"
                    className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 ${errors.applicationNo ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.applicationNo && <p className="text-red-500 text-xs mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={student.dob}
                    onChange={e => setStudent(s => ({ ...s, dob: e.target.value }))}
                    className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 ${errors.dob ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.dob && <p className="text-red-500 text-xs mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Exam Centre</label>
                  <select
                    value={student.examCenter}
                    onChange={e => setStudent(s => ({ ...s, examCenter: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option>Government Engineering College, Thrissur</option>
                    <option>Model Engineering College, Ernakulam</option>
                    <option>NIT Calicut</option>
                    <option>Rajagiri School of Engineering, Ernakulam</option>
                    <option>College of Engineering, Trivandrum</option>
                    <option>TKM College of Engineering, Kollam</option>
                    <option>Mar Athanasius College, Kothamangalam</option>
                  </select>
                </div>

                {/* Exam Info */}
                <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Exam Date:</span>
                    <span className="font-semibold">2025-06-05</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Session:</span>
                    <span className="font-semibold">Morning (9:30 AM)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">180 Minutes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-semibold">150</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Total Marks:</span>
                    <span className="font-semibold">600</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-300 rounded shadow-sm">
              <div className="bg-[#1565c0] text-white px-4 py-2 rounded-t flex items-center gap-2">
                <span className="text-yellow-300">⚠</span>
                <h2 className="font-semibold text-sm">General Instructions — Please Read Carefully</h2>
              </div>
              <div className="p-4 overflow-y-auto max-h-[480px] text-sm space-y-4">

                {/* Exam Pattern */}
                <div>
                  <h3 className="font-bold text-[#1a237e] text-sm mb-2 border-b border-blue-200 pb-1">📋 Exam Pattern</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#e3f2fd]">
                          <th className="border border-gray-300 px-3 py-2 text-left">Section</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Questions</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Marks/Q</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Total Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">Mathematics</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">75</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">4</td>
                          <td className="border border-gray-300 px-3 py-2 text-center font-semibold">300</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 font-medium">Physics</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">45</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">4</td>
                          <td className="border border-gray-300 px-3 py-2 text-center font-semibold">180</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">Chemistry</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">30</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">4</td>
                          <td className="border border-gray-300 px-3 py-2 text-center font-semibold">120</td>
                        </tr>
                        <tr className="bg-blue-50 font-bold">
                          <td className="border border-gray-300 px-3 py-2">Total</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">150</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">—</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">600</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Marking Scheme */}
                <div>
                  <h3 className="font-bold text-[#1a237e] text-sm mb-2 border-b border-blue-200 pb-1">🎯 Marking Scheme</h3>
                  <ul className="space-y-1 text-xs list-none">
                    <li className="flex items-start gap-2">
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold flex-shrink-0">+4</span>
                      <span>For each <strong>correct</strong> response</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold flex-shrink-0">-1</span>
                      <span>For each <strong>incorrect</strong> response (negative marking)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-gray-400 text-white px-2 py-0.5 rounded text-xs font-bold flex-shrink-0">0</span>
                      <span>For <strong>unattempted</strong> questions (no negative marking)</span>
                    </li>
                  </ul>
                </div>

                {/* Question Status Legend */}
                <div>
                  <h3 className="font-bold text-[#1a237e] text-sm mb-2 border-b border-blue-200 pb-1">🔢 Question Status Legend</h3>
                  <div className="space-y-1.5">
                    {[
                      { color: 'bg-gray-400', label: 'Not Visited', desc: 'Question has not been visited yet' },
                      { color: 'bg-red-500', label: 'Not Answered', desc: 'Visited but no option selected' },
                      { color: 'bg-green-500', label: 'Answered', desc: 'Option selected and saved' },
                      { color: 'bg-purple-600', label: 'Marked for Review', desc: 'Marked for review without answering' },
                      { color: 'bg-purple-600', label: 'Answered & Marked', desc: 'Answered and marked for review (will be evaluated)' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`${item.color} text-white text-xs font-bold w-7 h-7 rounded flex items-center justify-center flex-shrink-0`}>
                          {i === 4 ? '✓' : i + 1}
                        </div>
                        <div>
                          <span className="font-semibold text-xs">{item.label}</span>
                          <span className="text-gray-500 text-xs"> — {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Instructions */}
                <div>
                  <h3 className="font-bold text-[#1a237e] text-sm mb-2 border-b border-blue-200 pb-1">🖱️ Navigation</h3>
                  <ul className="text-xs space-y-1 text-gray-700">
                    <li>• Click <strong>"Save & Next"</strong> to save your answer and move to the next question.</li>
                    <li>• Click <strong>"Mark for Review & Next"</strong> to mark question and move to next.</li>
                    <li>• Click <strong>"Clear Response"</strong> to deselect chosen option.</li>
                    <li>• Click <strong>"Previous"</strong> to go back to the previous question.</li>
                    <li>• Click a question number in the <strong>Question Palette</strong> to jump directly.</li>
                    <li>• You can switch between <strong>sections (Math/Physics/Chemistry)</strong> using the section tabs.</li>
                  </ul>
                </div>

                {/* Important Notes */}
                <div>
                  <h3 className="font-bold text-[#1a237e] text-sm mb-2 border-b border-blue-200 pb-1">⚠️ Important Notes</h3>
                  <ul className="text-xs space-y-1 text-gray-700">
                    <li>• The timer will start as soon as you click <strong>"Start Test"</strong>.</li>
                    <li>• Do not refresh the browser during the exam.</li>
                    <li>• Each question has <strong>5 options</strong>; only ONE is correct.</li>
                    <li>• The exam will auto-submit when the timer reaches zero.</li>
                    <li>• You can submit early by clicking the <strong>"Submit Test"</strong> button.</li>
                    <li>• Questions marked for review WITH an answer WILL be evaluated.</li>
                    <li>• This is a Computer Based Test (CBT) — no paper/pen required.</li>
                  </ul>
                </div>

                {/* Declaration */}
                <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs text-gray-700">
                      I have read and understood all the instructions. I declare that I will not use any unfair means and will abide by the rules and regulations set by the Commissioner for Entrance Examinations, Kerala.
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-4 pb-4 pt-2 flex justify-end">
                <button
                  onClick={handleStart}
                  disabled={!agreed}
                  className={`px-8 py-2.5 rounded font-bold text-sm transition-all ${
                    agreed
                      ? 'bg-[#1565c0] hover:bg-[#0d47a1] text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  I am ready to begin ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
