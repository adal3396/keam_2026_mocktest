import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Clock, Flag, ChevronLeft, ChevronRight, Send, Atom, FlaskConical, Calculator, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/Untitled design (1).png';

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string;
  imageUrl?: string;
  subject: string;
  marks: number;
  negativeMarks: number;
}

interface Attempt {
  id: string;
  startedAt: string;
  status: string;
}

const SUBJECT_CONFIG: Record<string, { icon: typeof Atom; label: string; color: string; bgColor: string; fallback: string }> = {
  physics: { icon: Atom, label: 'Physics', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', fallback: 'text-blue-600' },
  chemistry: { icon: FlaskConical, label: 'Chemistry', color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200', fallback: 'text-emerald-600' },
  mathematics: { icon: Calculator, label: 'Mathematics', color: 'text-violet-600', bgColor: 'bg-violet-50 border-violet-200', fallback: 'text-violet-600' },
};

export default function ExamTaking() {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const initialLoadRef = useRef(false);

  useEffect(() => {
    if (initialLoadRef.current) return;
    
    const load = async () => {
      if (!examId || !user) return;
      
      try {
        const examData = await api.exams.get(examId);
        if (!examData) { navigate('/dashboard'); return; }
        
        setExam(examData);
        setQuestions(examData.questions || []);

        if (examData.questions && examData.questions.length > 0) {
           setActiveSubject(examData.questions[0].subject);
        }

        const attemptData = await api.attempts.start(examId, user.uid);
        if (attemptData.error) throw new Error(attemptData.error);
        
        setAttempt(attemptData);

        // Calculate time left
        const start = new Date(attemptData.startedAt).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - start) / 1000);
        const total = examData.durationMinutes * 60;
        setTimeLeft(Math.max(0, total - elapsed));

        setLoading(false);
        initialLoadRef.current = true;
      } catch (err) {
        console.error('Load exam error:', err);
        toast.error('Failed to load exam. Please try again.');
        navigate('/dashboard');
      }
    };
    load();
  }, [examId, user, navigate]);

  useEffect(() => {
    if (timeLeft <= 0 || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam(true, 'timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  useEffect(() => {
    if (loading || submitting) return;

    const handleViolations = () => {
      if (document.visibilityState === 'hidden' || !document.hasFocus()) {
        console.warn('Cheating detected: window switch/blur');
        submitExam(true, 'cheating');
      }
    };

    document.addEventListener('visibilitychange', handleViolations);
    window.addEventListener('blur', handleViolations);

    return () => {
      document.removeEventListener('visibilitychange', handleViolations);
      window.removeEventListener('blur', handleViolations);
    };
  }, [loading, submitting, attempt]);

  const selectOption = async (option: string) => {
    if (!attempt || !questions[currentIdx]) return;
    const qId = questions[currentIdx].id;
    const newAnswer = answers[qId] === option ? null : option; // toggle if clicked again
    
    setAnswers(prev => {
      const next = { ...prev };
      if (!newAnswer) delete next[qId];
      else next[qId] = newAnswer;
      return next;
    });
    
    try {
      await api.attempts.saveAnswer({
        attemptId: attempt.id,
        questionId: qId,
        selectedOption: newAnswer,
        isMarkedForReview: markedForReview[qId] || false
      });
    } catch (err) {
      toast.error('Failed to sync answer. Checking connection...');
    }
  };

  const clearResponse = async () => {
    if (!attempt || !questions[currentIdx]) return;
    const qId = questions[currentIdx].id;
    setAnswers(prev => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    
    try {
      await api.attempts.saveAnswer({
        attemptId: attempt.id,
        questionId: qId,
        selectedOption: null,
        isMarkedForReview: markedForReview[qId] || false
      });
    } catch (err) {
      toast.error('Failed to clear answer.');
    }
  };

  const toggleReview = async () => {
    if (!attempt || !questions[currentIdx]) return;
    const qId = questions[currentIdx].id;
    const newVal = !markedForReview[qId];
    setMarkedForReview(prev => ({ ...prev, [qId]: newVal }));
    
    try {
      await api.attempts.saveAnswer({
        attemptId: attempt.id,
        questionId: qId,
        selectedOption: answers[qId] || null,
        isMarkedForReview: newVal
      });
    } catch (err) {
      toast.error('Failed to sync review status.');
    }
  };

  const submitExam = async (autoSubmit = false, reason: 'timeout' | 'cheating' | 'manual' = 'manual') => {
    if (!attempt || submitting) return;
    if (!autoSubmit && timeLeft > 0 && !confirm('Are you sure you want to submit? You cannot change answers after submission.')) return;
    
    setSubmitting(true);
    const tId = toast.loading('Calculating results...');
    try {
      await api.attempts.submit(attempt.id);
      
      let message = 'Exam submitted successfully!';
      if (reason === 'timeout') message = 'Time up! Test auto-submitted.';
      if (reason === 'cheating') message = 'Window switch detected! Test auto-submitted as per rules.';
      
      toast.success(message, { id: tId });
      navigate(`/results/${attempt.id}`);
    } catch (err) {
      toast.error('Submission failed. Please try again.', { id: tId });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-heading">Loading exam environment...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-4 border rounded-xl p-8 bg-card shadow-sm">
           <AlertTriangle className="w-12 h-12 text-warning mx-auto" />
           <h2 className="text-xl font-bold font-heading">No Questions Found</h2>
           <p className="text-muted-foreground text-sm">This exam does not have any questions available to take. It may be improperly configured or corrupted.</p>
           <Button onClick={() => navigate('/dashboard')} className="mt-4">Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  // Group questions by subject
  const subjectGroups = questions.reduce((acc, q, idx) => {
    const subj = q.subject || 'general';
    if (!acc[subj]) acc[subj] = [];
    acc[subj].push({ ...q, globalIdx: idx });
    return acc;
  }, {} as Record<string, (Question & { globalIdx: number })[]>);

  const availableSubjects = Object.keys(subjectGroups);
  
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const notVisitedCount = questions.length - Object.keys(answers).length;

  const validOptions = (['A', 'B', 'C', 'D', 'E'] as const).filter(opt => {
     if (opt === 'E') return !!currentQ.optionE;
     return !!(currentQ as any)[`option${opt}`];
  });

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* KEAM-style header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="bg-destructive text-white text-[10px] sm:text-xs py-1 px-4 text-center font-bold uppercase tracking-widest animate-pulse">
           Warning: Switching tabs or windows will result in immediate automatic submission.
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="KSU GECT logo" className="h-10 w-auto object-contain py-1" />
            <div className="hidden sm:block">
              <h1 className="font-heading font-bold text-sm">{exam?.title || 'KEAM Exam'}</h1>
              <p className="text-xs text-muted-foreground tracking-wide">MOCK EXAMINATION</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={cn(
              "flex items-center gap-2 font-heading font-bold sm:text-xl px-4 py-2 rounded-xl transition-colors",
              timeLeft < 300 ? "bg-destructive/10 text-destructive animate-pulse-soft" : "bg-primary/10 text-primary border border-primary/20 shadow-inner"
            )}>
              <Clock className="w-5 h-5" />
              {hours > 0 && `${String(hours).padStart(2, '0')}:`}{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Subject tabs */}
        <div className="flex border-t bg-muted/30">
          {availableSubjects.map(subject => {
            const config = SUBJECT_CONFIG[subject.toLowerCase()] || { icon: Flag, label: subject, color: 'text-primary' };
            const Icon = config.icon;
            const subjectQs = subjectGroups[subject];
            const subjectAnswered = subjectQs.filter(q => answers[q.id]).length;

            return (
              <button
                key={subject}
                onClick={() => {
                  setActiveSubject(subject);
                  setCurrentIdx(subjectQs[0].globalIdx);
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all border-b-2",
                  activeSubject === subject
                    ? cn(config.color || config.fallback, "border-current bg-card shadow-sm")
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 hidden sm:block" />
                <span className="capitalize">{config.label || subject}</span>
                <span className="text-xs opacity-60 hidden sm:block">({subjectAnswered}/{subjectQs.length})</span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Question area */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto w-full">
          {currentQ && (
            <div className="max-w-4xl mx-auto space-y-5 pb-20">
              {/* Question header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "px-4 py-1.5 rounded-xl text-sm font-heading font-bold border shadow-sm",
                    SUBJECT_CONFIG[currentQ.subject.toLowerCase()]?.bgColor || "bg-primary/5 border-primary/20 text-primary"
                  )}>
                    Question {currentIdx + 1} of {questions.length}
                  </div>
                  <div className="text-xs font-semibold px-3 py-1 rounded-full bg-card border shadow-sm">
                    Marks: <span className="text-success ml-1">+{currentQ.marks}</span> <span className="text-muted-foreground mx-1">|</span> <span className="text-destructive">-{currentQ.negativeMarks}</span>
                  </div>
                </div>
              </div>

              {/* Question text & image */}
              <Card className={cn(
                "border-l-4 overflow-hidden rounded-2xl shadow-sm",
                SUBJECT_CONFIG[currentQ.subject.toLowerCase()]?.color ? `border-l-${SUBJECT_CONFIG[currentQ.subject.toLowerCase()].color.split('-')[1]}-500` : "border-l-primary"
              )}>
                <CardContent className="p-6 md:p-8 space-y-6">
                  <p className="text-lg leading-relaxed font-medium whitespace-pre-wrap">{currentQ.questionText}</p>
                  {currentQ.imageUrl && (
                    <div className="rounded-xl overflow-hidden border shadow-inner bg-slate-50 dark:bg-slate-900/50 p-4">
                      <img src={currentQ.imageUrl} alt="Question figure" className="max-h-[400px] mx-auto object-contain rounded-lg" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Options - KEAM style with interactive buttons */}
              <div className="grid grid-cols-1 gap-3">
                {validOptions.map(opt => {
                  const isSelected = answers[currentQ.id] === opt;
                  const optionText = opt === 'E' ? currentQ.optionE : (currentQ as any)[`option${opt}`];
                  
                  return (
                    <button
                      key={opt}
                      onClick={() => selectOption(opt)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                          : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                      )}
                    >
                      <span className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                          : "border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50"
                      )}>
                        {opt}
                      </span>
                      <span className={cn("text-base", isSelected ? "font-semibold text-foreground" : "text-muted-foreground")}>{optionText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action buttons - Sticky to bottom on mobile, inline on desktop */}
              <div className="flex flex-wrap items-center gap-3 pt-6 lg:border-t-0 p-4 lg:p-0 bg-background lg:bg-transparent rounded-t-2xl lg:rounded-none z-10 bottom-0 left-0 right-0 lg:sticky">
                <Button
                  variant={markedForReview[currentQ.id] ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleReview}
                  className={cn(
                    "rounded-full transition-all",
                    markedForReview[currentQ.id] && "bg-warning text-warning-foreground hover:bg-warning/90 border-none shadow-md shadow-warning/20"
                  )}
                >
                  <Flag className={cn("w-4 h-4 mr-2", markedForReview[currentQ.id] ? "fill-current" : "")} />
                  {markedForReview[currentQ.id] ? 'Marked' : 'Mark for Review'}
                </Button>
                
                <Button variant="ghost" size="sm" onClick={clearResponse} disabled={!answers[currentQ.id]} className="rounded-full hidden sm:flex">
                  Clear
                </Button>
                
                <div className="flex-1" />
                
                <Button variant="outline" className="rounded-full" disabled={currentIdx === 0} onClick={() => { setCurrentIdx(prev => prev - 1); setActiveSubject(questions[currentIdx - 1]?.subject); }}>
                  <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Previous</span>
                </Button>
                
                {currentIdx < questions.length - 1 ? (
                  <Button className="rounded-full shadow-md shadow-primary/20" onClick={() => { setCurrentIdx(prev => prev + 1); setActiveSubject(questions[currentIdx + 1]?.subject); }}>
                    Save & Next <ChevronRight className="w-4 h-4 ml-1 sm:mr-2" />
                  </Button>
                ) : (
                  <Button variant="destructive" className="rounded-full shadow-md shadow-destructive/20" disabled={submitting} onClick={() => submitExam(false)}>
                    <Send className="w-4 h-4 mr-2" /> Submit Test
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right panel - Question palette */}
        <div className="hidden lg:flex flex-col w-80 border-l bg-card shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          {/* Status summary */}
          <div className="p-5 border-b space-y-4 bg-muted/20">
            <h3 className="font-heading font-bold text-sm tracking-wider uppercase text-muted-foreground">Question Palette</h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-medium">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-success flex items-center justify-center text-success-foreground font-bold shadow-inner">{answeredCount}</div>
                <span className="text-slate-600 dark:text-slate-400">Answered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-card border flex items-center justify-center font-bold text-muted-foreground shadow-sm">{notVisitedCount}</div>
                <span className="text-slate-600 dark:text-slate-400">Not Visited</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-warning flex items-center justify-center text-warning-foreground font-bold shadow-inner">{markedCount}</div>
                <span className="text-slate-600 dark:text-slate-400">Marked</span>
              </div>
            </div>
          </div>

          {/* Question numbers by subject */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {availableSubjects.map(subject => {
              const config = SUBJECT_CONFIG[subject.toLowerCase()] || { color: 'text-primary', label: subject };
              const qs = subjectGroups[subject];
              
              return (
                <div key={subject}>
                  <p className={cn("text-xs font-heading font-bold mb-3 uppercase tracking-wider", config.color || config.fallback)}>
                    {config.label || subject}
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {qs.map(q => {
                      const ans = answers[q.id];
                      const marked = markedForReview[q.id];
                      
                      let bgClass = 'bg-card border text-muted-foreground hover:bg-muted';
                      if (marked && ans) bgClass = 'bg-warning text-warning-foreground shadow-sm ring-1 ring-warning/50';
                      else if (marked) bgClass = 'bg-warning/80 text-warning-foreground shadow-sm';
                      else if (ans) bgClass = 'bg-success text-success-foreground shadow-sm';

                      return (
                        <button
                          key={q.id}
                          onClick={() => { setCurrentIdx(q.globalIdx); setActiveSubject(subject); }}
                          className={cn(
                            "w-full aspect-square rounded-xl text-xs font-bold transition-all flex items-center justify-center",
                            bgClass,
                            q.globalIdx === currentIdx && "ring-2 ring-primary ring-offset-2 scale-110 z-10 shadow-md"
                          )}
                        >
                          {q.globalIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit button */}
          <div className="p-5 border-t bg-muted/10">
            <Button variant="destructive" size="lg" className="w-full rounded-xl shadow-lg shadow-destructive/20 font-bold" disabled={submitting} onClick={() => submitExam(false)}>
              <Send className="w-5 h-5 mr-2" /> Submit Full Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
