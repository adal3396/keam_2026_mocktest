import { useState, useEffect, useCallback, useRef } from 'react';
import { InstructionPage } from './components/InstructionPage';
import { ExamHeader } from './components/ExamHeader';
import { SectionTabs } from './components/SectionTabs';
import { QuestionView } from './components/QuestionView';
import { QuestionPalette } from './components/QuestionPalette';
import { ResultPage } from './components/ResultPage';
import { MOCK_QUESTIONS } from './data/mockQuestions';
import { Question, StudentInfo, Subject } from './types';
import { registerAndStartExam, saveProgress, submitExam, SubmitResult } from './lib/examApi';

const TOTAL_TIME = 180 * 60; // 180 minutes in seconds

type AppView = 'instruction' | 'exam' | 'result';

export default function App() {
  const [view, setView] = useState<AppView>('instruction');
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [questions] = useState<Question[]>(MOCK_QUESTIONS);

  // Exam state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [activeSubject, setActiveSubject] = useState<Subject | 'All'>('All');
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [_startTime, setStartTime] = useState(0);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autosaveRef = useRef<ReturnType<typeof setInterval> | null>(null);



  const currentQuestion = questions[currentIdx];

  // Mark current question as visited whenever currentIdx changes
  useEffect(() => {
    if (view === 'exam' && currentQuestion) {
      setVisited(prev => new Set(prev).add(currentQuestion.id));
    }
  }, [currentIdx, view, currentQuestion]);

  useEffect(() => {
    if (view !== 'exam' || !sessionId) return;
    autosaveRef.current = setInterval(() => {
      void saveProgress({
        sessionId,
        answers,
        markedForReview: [...markedForReview],
        visited: [...visited],
      }).catch(() => undefined);
    }, 15000);

    return () => {
      if (autosaveRef.current) clearInterval(autosaveRef.current);
    };
  }, [answers, markedForReview, sessionId, view, visited]);

  // Timer
  useEffect(() => {
    if (view === 'exam') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [view]);

  const handleAutoSubmit = useCallback(async () => {
    if (!sessionId) return;
    clearInterval(timerRef.current!);
    try {
      const result = await submitExam({
        sessionId,
        questions,
        answers,
        markedForReview: [...markedForReview],
        visited: [...visited],
        timeTakenSeconds: TOTAL_TIME,
      });
      setSubmitResult(result);
      setView('result');
    } catch {
      setErrorMessage('Auto submit failed. Please submit manually.');
    }
  }, [answers, markedForReview, questions, sessionId, visited]);

  const handleStart = async (info: StudentInfo) => {
    setIsLoading(true);
    setErrorMessage(null);
    setStudent(info);
    try {
      const session = await registerAndStartExam(info);
      setSessionId(session.sessionId);
      setStartTime(Date.now());
      setCurrentIdx(0);
      setAnswers({});
      setMarkedForReview(new Set());
      setVisited(new Set([questions[0].id]));
      setTimeLeft(TOTAL_TIME);
      setActiveSubject('All');
      setView('exam');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to start exam. Check Supabase configuration and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    clearInterval(timerRef.current!);
    setView('instruction');
    setStudent(null);
    setAnswers({});
    setMarkedForReview(new Set());
    setVisited(new Set());
    setCurrentIdx(0);
    setTimeLeft(TOTAL_TIME);
    setSessionId(null);
    setSubmitResult(null);
    setErrorMessage(null);
  };

  // Navigate to a specific question index (global)
  const goToQuestion = (idx: number) => {
    setCurrentIdx(idx);
    setVisited(prev => new Set(prev).add(questions[idx].id));
    // Sync active subject tab
    const subj = questions[idx].subject;
    setActiveSubject(subj);
  };

  // Save answer and go next
  const handleSaveNext = () => {
    // Move to next in global list
    const nextIdx = currentIdx + 1 < questions.length ? currentIdx + 1 : currentIdx;
    if (currentIdx + 1 < questions.length) {
      goToQuestion(nextIdx);
    }
  };

  // Mark for review and go next
  const handleMarkReviewNext = () => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      next.add(currentQuestion.id);
      return next;
    });
    const nextIdx = currentIdx + 1 < questions.length ? currentIdx + 1 : currentIdx;
    if (currentIdx + 1 < questions.length) {
      goToQuestion(nextIdx);
    }
  };

  // Clear response
  const handleClearResponse = () => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  // Select an option
  const handleSelectOption = (optIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optIdx }));
  };

  // Previous
  const handlePrevious = () => {
    if (currentIdx > 0) {
      goToQuestion(currentIdx - 1);
    }
  };

  // Submit confirmation
  const handleSubmitRequest = () => setSubmitModalOpen(true);

  const handleConfirmSubmit = async () => {
    if (!sessionId) return;
    clearInterval(timerRef.current!);
    setSubmitModalOpen(false);
    setIsLoading(true);
    try {
      const result = await submitExam({
        sessionId,
        questions,
        answers,
        markedForReview: [...markedForReview],
        visited: [...visited],
        timeTakenSeconds: TOTAL_TIME - timeLeft,
      });
      setSubmitResult(result);
      setView('result');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to submit exam. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Subject change from tab
  const handleSubjectChange = (subj: Subject | 'All') => {
    setActiveSubject(subj);
    // Jump to first question in that section
    const firstQ = subj === 'All'
      ? questions[0]
      : questions.find(q => q.subject === subj);
    if (firstQ) {
      const idx = questions.findIndex(q => q.id === firstQ.id);
      setCurrentIdx(idx);
      setVisited(prev => new Set(prev).add(firstQ.id));
    }
  };

  // Subject counts
  const subjectCounts = {
    Mathematics: questions.filter(q => q.subject === 'Mathematics').length,
    Physics: questions.filter(q => q.subject === 'Physics').length,
    Chemistry: questions.filter(q => q.subject === 'Chemistry').length,
  };

  const timeTaken = TOTAL_TIME - timeLeft;

  if (view === 'instruction') {
    return (
      <>
        <InstructionPage onStart={handleStart} />
        {isLoading && <div className="fixed top-3 right-3 z-50 bg-blue-700 text-white text-xs px-3 py-2 rounded">Starting exam...</div>}
        {errorMessage && <div className="fixed bottom-3 right-3 z-50 bg-red-600 text-white text-xs px-3 py-2 rounded">{errorMessage}</div>}
      </>
    );
  }

  if (view === 'result') {
    return (
      <ResultPage
        questions={questions}
        answers={answers}
        student={student!}
        timeTaken={timeTaken}
        onRetry={handleRetry}
        serverResult={submitResult}
      />
    );
  }

  // ─── EXAM VIEW ───
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-200">
      {/* Top Header */}
      <ExamHeader
        student={student!}
        timeLeft={timeLeft}
        onSubmit={handleSubmitRequest}
      />

      {/* Section tabs */}
      <SectionTabs
        activeSubject={activeSubject}
        onSubjectChange={handleSubjectChange}
        counts={subjectCounts}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {currentQuestion && (
            <QuestionView
              question={currentQuestion}
              questionIndex={currentIdx}
              totalQuestions={questions.length}
              selectedOption={answers[currentQuestion.id]}
              isMarked={markedForReview.has(currentQuestion.id)}
              onSelectOption={handleSelectOption}
              onSaveNext={handleSaveNext}
              onMarkReviewNext={handleMarkReviewNext}
              onClearResponse={handleClearResponse}
              onPrevious={handlePrevious}
            />
          )}
        </div>

        {/* Right Sidebar — Question Palette */}
        <div className="w-56 flex-shrink-0 overflow-hidden flex flex-col border-l border-gray-400">
          <QuestionPalette
            questions={questions}
            currentIdx={currentIdx}
            answers={answers}
            markedForReview={markedForReview}
            visited={visited}
            activeSubject={activeSubject}
            onQuestionClick={goToQuestion}
          />
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-[#1565c0] text-white px-5 py-3">
              <h2 className="font-bold text-base">Confirm Test Submission</h2>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-700 mb-4">
                Are you sure you want to submit your test? Once submitted, you cannot go back.
              </p>

              {/* Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <strong>{questions.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Answered:</span>
                  <strong className="text-green-600">{Object.keys(answers).length}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Not Answered:</span>
                  <strong className="text-red-600">
                    {[...visited].filter(id => answers[id] === undefined).length}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Not Visited:</span>
                  <strong className="text-gray-500">
                    {questions.length - visited.size}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600">Marked for Review:</span>
                  <strong className="text-purple-600">{markedForReview.size}</strong>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                ⚠ Questions marked for review with an answer <strong>will be evaluated</strong>. Unanswered questions carry no negative marks.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-5 py-2 border border-gray-400 text-gray-700 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel — Continue Exam
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isLoading}
                  className="px-5 py-2 bg-red-600 text-white rounded text-sm font-bold hover:bg-red-700 transition-colors"
                >
                  {isLoading ? 'Submitting...' : 'Submit Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {errorMessage && <div className="fixed bottom-3 right-3 z-50 bg-red-600 text-white text-xs px-3 py-2 rounded">{errorMessage}</div>}
    </div>
  );
}
