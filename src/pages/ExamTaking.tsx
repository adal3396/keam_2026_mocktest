import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Clock, ChevronLeft, ChevronRight, Flag, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  imageUrl?: string;
  subject: string;
  marks: number;
}

interface Attempt {
  id: string;
  startedAt: string;
  status: string;
}

export default function ExamTaking() {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isQuestionNavOpen, setIsQuestionNavOpen] = useState(true);

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

        const attemptData = await api.attempts.start(examId, user.uid);
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
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const selectOption = async (option: string) => {
    if (!attempt || !questions[currentIdx]) return;
    const qId = questions[currentIdx].id;
    setAnswers(prev => ({ ...prev, [qId]: option }));
    
    try {
      await api.attempts.saveAnswer({
        attemptId: attempt.id,
        questionId: qId,
        selectedOption: option,
        isMarkedForReview: markedForReview[qId]
      });
    } catch (err) {
      toast.error('Failed to sync answer. Checking connection...');
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
        selectedOption: answers[qId],
        isMarkedForReview: newVal
      });
    } catch (err) {
      toast.error('Failed to sync review status.');
    }
  };

  const submitExam = async () => {
    if (!attempt || submitting) return;
    if (timeLeft > 0 && !confirm('Are you sure you want to submit?')) return;
    
    setSubmitting(true);
    const tId = toast.loading('Calculating results...');
    try {
      await api.attempts.submit(attempt.id);
      toast.success('Exam submitted!', { id: tId });
      navigate(`/results/${attempt.id}`);
    } catch (err) {
      toast.error('Submission failed. Please try again.', { id: tId });
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const currentQuestion = questions[currentIdx];
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const subjects = ['physics', 'chemistry', 'mathematics'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-heading font-bold truncate max-w-[200px] sm:max-w-md">{exam.title}</h1>
            <Badge variant={timeLeft < 300 ? 'destructive' : 'outline'} className="flex items-center gap-1.5 font-mono text-sm">
              <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
            </Badge>
          </div>
          <Button onClick={submitExam} disabled={submitting} className="rounded-full px-6 bg-primary hover:bg-primary/90">
             <Send className="w-4 h-4 mr-2" /> Submit
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                 <div className="p-6 border-b flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                   <div className="flex items-center gap-3">
                     <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-heading font-bold shadow-lg shadow-primary/20">
                       {currentIdx + 1}
                     </span>
                     <Badge variant="outline" className="capitalize px-3 py-1 border-primary/20 bg-primary/5 text-primary">
                       {currentQuestion.subject}
                     </Badge>
                   </div>
                   <div className="text-sm font-medium text-slate-500">
                     {currentQuestion.marks} Marks
                   </div>
                 </div>

                 <div className="p-8 space-y-8">
                   <div className="space-y-6">
                     <p className="text-lg leading-relaxed font-medium whitespace-pre-wrap">{currentQuestion.questionText}</p>
                     {currentQuestion.imageUrl && (
                       <div className="rounded-2xl overflow-hidden border shadow-inner bg-slate-50 dark:bg-slate-800">
                         <img src={currentQuestion.imageUrl} alt="Question figure" className="max-h-[400px] mx-auto object-contain" />
                       </div>
                     )}
                   </div>

                   <RadioGroup value={answers[currentQuestion.id] || ''} onValueChange={selectOption} className="space-y-4">
                     {(['A', 'B', 'C', 'D', 'E'] as const).map(opt => {
                       const optValue = opt === 'E' ? currentQuestion.optionE : (currentQuestion as any)[`option${opt}`];
                       if (opt === 'E' && !optValue) return null;
                       
                       return (
                         <Label
                           key={opt}
                           className={cn(
                             "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800",
                             answers[currentQuestion.id] === opt ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-transparent bg-slate-100/50 dark:bg-slate-800/50"
                           )}
                         >
                           <RadioGroupItem value={opt} className="sr-only" />
                           <span className={cn(
                             "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-colors",
                             answers[currentQuestion.id] === opt ? "bg-primary text-primary-foreground" : "bg-white dark:bg-slate-700 text-slate-400"
                           )}>
                             {opt}
                           </span>
                           <span className="flex-1 font-medium">{optValue}</span>
                         </Label>
                       );
                     })}
                   </RadioGroup>
                 </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-4">
               <div className="flex gap-2">
                 <Button variant="outline" size="lg" className="rounded-2xl" onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))} disabled={currentIdx === 0}>
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                 </Button>
                 <Button variant="outline" size="lg" className="rounded-2xl" onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentIdx === questions.length - 1}>
                   Next <ChevronRight className="w-4 h-4 ml-2" />
                 </Button>
               </div>
               
               <Button 
                 variant={markedForReview[currentQuestion.id] ? 'default' : 'outline'} 
                 size="lg" 
                 className={cn("rounded-2xl", markedForReview[currentQuestion.id] && "bg-orange-500 hover:bg-orange-600 border-none")} 
                 onClick={toggleReview}
               >
                 <Flag className={cn("w-4 h-4 mr-2", markedForReview[currentQuestion.id] ? "fill-white" : "")} />
                 {markedForReview[currentQuestion.id] ? 'Marked' : 'Mark for Review'}
               </Button>
            </div>
          </div>
        </main>

        <aside className={cn(
          "w-80 border-l bg-background flex flex-col transition-all duration-300",
          !isQuestionNavOpen && "w-0 border-l-0"
        )}>
          <div className="p-4 border-b flex items-center justify-between shrink-0">
            <h3 className="font-heading font-bold flex items-center gap-2 uppercase tracking-wider text-sm text-slate-400">
              Question Navigator
            </h3>
            <Button variant="ghost" size="icon" onClick={() => setIsQuestionNavOpen(false)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {subjects.map(subject => {
                const subQuestions = questions.filter(q => q.subject === subject);
                if (subQuestions.length === 0) return null;
                
                return (
                  <div key={subject} className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400/80 px-1">{subject}</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {subQuestions.map(q => {
                        const idx = questions.indexOf(q);
                        const isAnswered = !!answers[q.id];
                        const isMarked = !!markedForReview[q.id];
                        const isCurrent = currentIdx === idx;
                        
                        return (
                          <button
                            key={q.id}
                            onClick={() => setCurrentIdx(idx)}
                            className={cn(
                              "w-10 h-10 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95",
                              isCurrent ? "ring-2 ring-primary ring-offset-2" : "",
                              isMarked ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" :
                              isAnswered ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : 
                              "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            )}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-900 grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-tighter shrink-0 border-t">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary" /> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-orange-500" /> Review</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" /> Pending</div>
          </div>
        </aside>
        
        {!isQuestionNavOpen && (
          <Button 
            variant="secondary" 
            size="icon" 
            className="fixed right-4 bottom-24 rounded-full shadow-2xl h-12 w-12" 
            onClick={() => setIsQuestionNavOpen(true)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
