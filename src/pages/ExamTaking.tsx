import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Clock, Flag, ChevronLeft, ChevronRight, Send, Atom, FlaskConical, Calculator } from 'lucide-react';
import logoImage from '@/assets/Untitled design (1).png';

interface Question {
  id: string;
  subject: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;  
  marks: number;
  negative_marks: number;
  question_order: number;
}

interface AttemptWithExam {
  id: string;
  started_at: string;
  status: string;
  exams: {
    id: string;
    title: string;
    duration_minutes: number;
  } | null;
}

interface Answer {
  question_id: string;
  selected_option: string | null;
  is_marked_for_review: boolean;
}

const SUBJECT_CONFIG: Record<string, { icon: typeof Atom; label: string; color: string; bgColor: string }> = {
  physics: { icon: Atom, label: 'Physics', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
  chemistry: { icon: FlaskConical, label: 'Chemistry', color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200' },
  mathematics: { icon: Calculator, label: 'Mathematics', color: 'text-violet-600', bgColor: 'bg-violet-50 border-violet-200' },
};

export default function ExamTaking() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examTitle, setExamTitle] = useState('');
  const [examId, setExamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number>(0);
  const submitInFlightRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      const { data: attempt } = await supabase
        .from('exam_attempts')
        .select('*, exams(*)')
        .eq('id', attemptId!)
        .single();
      const typedAttempt = attempt as AttemptWithExam | null;

      if (!typedAttempt || typedAttempt.status === 'submitted') {
        navigate(`/results/${attemptId}`);
        return;
      }

      const exam = typedAttempt.exams;
      if (!exam) {
        navigate('/dashboard');
        return;
      }
      setExamTitle(exam.title);
      setExamId(exam.id);

      const startTime = new Date(typedAttempt.started_at).getTime();
      const endTime = startTime + exam.duration_minutes * 60 * 1000;
      endTimeRef.current = endTime;
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      const { data: qs } = await supabase
        .rpc('get_attempt_questions', { _attempt_id: attemptId! });

      if (qs) {
        setQuestions(qs as Question[]);
        if (qs.length > 0) setActiveSubject((qs[0] as Question).subject);
      }

      const { data: existingAnswers } = await supabase
        .from('answers')
        .select('*')
        .eq('attempt_id', attemptId!);

      if (existingAnswers) {
        const map = new Map<string, Answer>();
        existingAnswers.forEach(a => {
          map.set(a.question_id, {
            question_id: a.question_id,
            selected_option: a.selected_option,
            is_marked_for_review: a.is_marked_for_review ?? false,
          });
        });
        setAnswers(map);
      }

      setLoading(false);
    };
    load();
  }, [attemptId, navigate]);

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submitInFlightRef.current) return;
    if (!autoSubmit && !confirm('Are you sure you want to submit? You cannot change answers after submission.')) return;

    submitInFlightRef.current = true;
    setSubmitting(true);

    const { error } = await supabase.rpc('submit_exam_attempt', { _attempt_id: attemptId! });

    submitInFlightRef.current = false;
    setSubmitting(false);

    if (error) {
      toast.error(error.message || 'Failed to submit exam');
      return;
    }

    toast.success(autoSubmit ? 'Time up! Exam auto-submitted.' : 'Exam submitted successfully!');
    navigate(`/results/${attemptId}`);
  }, [attemptId, navigate]);

  useEffect(() => {
    if (loading) return;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0 && !submitInFlightRef.current) {
        void handleSubmit(true);
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, handleSubmit]);

  useEffect(() => {
    if (!examId) return;

    // Listen for admin ending the exam real-time!
    const channel = supabase
      .channel(`public:exams:taker:${examId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'exams', filter: `id=eq.${examId}` },
        (payload) => {
          const newRecord = payload.new as any;
          if (newRecord && newRecord.is_active === false) {
             console.log('🚨 ADMIN DEACTIVATED THE EXAM - AUTO SUBMITTING');
             toast.error('The admin has ended this exam!', { duration: 5000 });
             if (!submitInFlightRef.current) {
               handleSubmit(true);
             }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [examId, handleSubmit]);

  const selectOption = async (questionId: string, option: string) => {
    const existing = answers.get(questionId);
    const newOption = existing?.selected_option === option ? null : option;
    const newAnswer: Answer = {
      question_id: questionId,
      selected_option: newOption,
      is_marked_for_review: existing?.is_marked_for_review ?? false,
    };
    setAnswers(prev => {
      const next = new Map(prev);
      next.set(questionId, newAnswer);
      return next;
    });

    const { error } = await supabase.from('answers').upsert({
      attempt_id: attemptId!,
      question_id: questionId,
      selected_option: newOption,
      is_marked_for_review: newAnswer.is_marked_for_review,
    }, { onConflict: 'attempt_id,question_id' });
    if (error) toast.error('Failed to save answer');
  };

  const toggleReview = async (questionId: string) => {
    const existing = answers.get(questionId);
    const newMarked = !(existing?.is_marked_for_review ?? false);
    const newAnswer: Answer = {
      question_id: questionId,
      selected_option: existing?.selected_option ?? null,
      is_marked_for_review: newMarked,
    };
    setAnswers(prev => {
      const next = new Map(prev);
      next.set(questionId, newAnswer);
      return next;
    });

    const { error } = await supabase.from('answers').upsert({
      attempt_id: attemptId!,
      question_id: questionId,
      selected_option: newAnswer.selected_option,
      is_marked_for_review: newMarked,
    }, { onConflict: 'attempt_id,question_id' });
    if (error) toast.error('Failed to update review mark');
  };

  const clearResponse = async (questionId: string) => {
    const existing = answers.get(questionId);
    const newAnswer: Answer = {
      question_id: questionId,
      selected_option: null,
      is_marked_for_review: existing?.is_marked_for_review ?? false,
    };
    setAnswers(prev => {
      const next = new Map(prev);
      next.set(questionId, newAnswer);
      return next;
    });

    const { error } = await supabase.from('answers').upsert({
      attempt_id: attemptId!,
      question_id: questionId,
      selected_option: null,
      is_marked_for_review: newAnswer.is_marked_for_review,
    }, { onConflict: 'attempt_id,question_id' });
    if (error) toast.error('Failed to clear response');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-heading">Loading exam...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const currentAnswer = currentQ ? answers.get(currentQ.id) : undefined;
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  // Group questions by subject
  const subjectGroups = questions.reduce((acc, q, idx) => {
    if (!acc[q.subject]) acc[q.subject] = [];
    acc[q.subject].push({ ...q, globalIdx: idx });
    return acc;
  }, {} as Record<string, (Question & { globalIdx: number })[]>);

  const subjectOrder = ['physics', 'chemistry', 'mathematics'];
  const availableSubjects = subjectOrder.filter(s => subjectGroups[s]);

  const answered = Array.from(answers.values()).filter(a => a.selected_option).length;
  const marked = Array.from(answers.values()).filter(a => a.is_marked_for_review).length;
  const notVisited = questions.length - answers.size;

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* KEAM-style header */}
      <header className="bg-card border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="KSU GECT logo" className="h-10 w-auto object-contain py-1" />
            <div>
              <h1 className="font-heading font-bold text-sm">{examTitle}</h1>
              <p className="text-xs text-muted-foreground">KEAM Mock Examination</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 font-heading font-bold text-xl px-4 py-2 rounded-lg ${
              timeLeft < 300 ? 'bg-destructive/10 text-destructive animate-pulse-soft' : 'bg-primary/5 text-primary'
            }`}>
              <Clock className="w-5 h-5" />
              {hours > 0 && `${String(hours).padStart(2, '0')}:`}{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Subject tabs */}
        <div className="flex border-t bg-muted/50">
          {availableSubjects.map(subject => {
            const config = SUBJECT_CONFIG[subject];
            const Icon = config.icon;
            const subjectQs = subjectGroups[subject];
            const subjectAnswered = subjectQs.filter(q => answers.get(q.id)?.selected_option).length;

            return (
              <button
                key={subject}
                onClick={() => {
                  setActiveSubject(subject);
                  setCurrentIdx(subjectQs[0].globalIdx);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all border-b-2 ${
                  activeSubject === subject
                    ? `${config.color} border-current bg-card`
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {config.label}
                <span className="text-xs opacity-60">({subjectAnswered}/{subjectQs.length})</span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Question area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {currentQ && (
            <div className="max-w-4xl mx-auto space-y-5">
              {/* Question header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-lg text-sm font-heading font-bold border ${SUBJECT_CONFIG[currentQ.subject]?.bgColor}`}>
                    Question {currentIdx + 1} of {questions.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Marks: <span className="font-bold text-success">+{currentQ.marks}</span> / <span className="font-bold text-destructive">-{currentQ.negative_marks}</span>
                  </div>
                </div>
              </div>

              {/* Question text */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{currentQ.question_text}</p>
                </CardContent>
              </Card>

              {/* Options - KEAM style with radio buttons */}
              <div className="space-y-3">
                {(['A', 'B', 'C', 'D'] as const).map(opt => {
                  const isSelected = currentAnswer?.selected_option === opt;
                  const optionTextByKey: Record<'A' | 'B' | 'C' | 'D', string> = {
                    A: currentQ.option_a,
                    B: currentQ.option_b,
                    C: currentQ.option_c,
                    D: currentQ.option_d,
                  };
                  return (
                    <button
                      key={opt}
                      onClick={() => selectOption(currentQ.id, opt)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-muted-foreground/30 text-muted-foreground'
                      }`}>
                        {opt}
                      </span>
                      <span className={isSelected ? 'font-medium' : ''}>{optionTextByKey[opt]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action buttons - KEAM style */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant={currentAnswer?.is_marked_for_review ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleReview(currentQ.id)}
                  className={currentAnswer?.is_marked_for_review ? 'bg-warning text-warning-foreground hover:bg-warning/90' : ''}
                >
                  <Flag className="w-4 h-4 mr-1" /> Mark for Review
                </Button>
                <Button variant="outline" size="sm" onClick={() => clearResponse(currentQ.id)}>
                  Clear Response
                </Button>
                <div className="flex-1" />
                <Button variant="outline" disabled={currentIdx === 0} onClick={() => { setCurrentIdx(prev => prev - 1); setActiveSubject(questions[currentIdx - 1]?.subject); }}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                {currentIdx < questions.length - 1 ? (
                  <Button onClick={() => { setCurrentIdx(prev => prev + 1); setActiveSubject(questions[currentIdx + 1]?.subject); }}>
                    Save & Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                <Button variant="destructive" disabled={submitting} onClick={() => handleSubmit()}>
                    <Send className="w-4 h-4 mr-1" /> Submit Test
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right panel - Question palette */}
        <div className="hidden lg:flex flex-col w-72 border-l bg-card">
          {/* Status summary */}
          <div className="p-4 border-b space-y-3">
            <h3 className="font-heading font-bold text-sm">Question Palette</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-success flex items-center justify-center text-success-foreground font-bold text-[10px]">{answered}</div>
                <span className="text-muted-foreground">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-destructive/20 border border-destructive/30 flex items-center justify-center font-bold text-[10px]">{questions.length - answered - notVisited}</div>
                <span className="text-muted-foreground">Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-warning flex items-center justify-center text-warning-foreground font-bold text-[10px]">{marked}</div>
                <span className="text-muted-foreground">Marked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-muted border flex items-center justify-center font-bold text-[10px]">{notVisited}</div>
                <span className="text-muted-foreground">Not Visited</span>
              </div>
            </div>
          </div>

          {/* Question numbers by subject */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {availableSubjects.map(subject => {
              const config = SUBJECT_CONFIG[subject];
              const qs = subjectGroups[subject];
              return (
                <div key={subject}>
                  <p className={`text-xs font-heading font-bold mb-2 ${config.color}`}>{config.label}</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {qs.map(q => {
                      const ans = answers.get(q.id);
                      let bgClass = 'bg-muted text-muted-foreground';
                      if (ans?.is_marked_for_review && ans?.selected_option) bgClass = 'bg-warning text-warning-foreground';
                      else if (ans?.is_marked_for_review) bgClass = 'bg-warning/60 text-warning-foreground';
                      else if (ans?.selected_option) bgClass = 'bg-success text-success-foreground';
                      else if (ans) bgClass = 'bg-destructive/20 text-foreground';

                      return (
                        <button
                          key={q.id}
                          onClick={() => { setCurrentIdx(q.globalIdx); setActiveSubject(subject); }}
                          className={`w-full aspect-square rounded-lg text-xs font-bold transition-all ${bgClass} ${
                            q.globalIdx === currentIdx ? 'ring-2 ring-primary ring-offset-1' : 'hover:scale-105'
                          }`}
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
          <div className="p-4 border-t">
            <Button variant="destructive" className="w-full" disabled={submitting} onClick={() => handleSubmit()}>
              <Send className="w-4 h-4 mr-1" /> Submit Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
