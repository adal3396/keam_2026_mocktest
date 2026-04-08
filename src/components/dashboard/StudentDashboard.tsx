import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, Trophy, BarChart3, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { toast } from 'sonner';

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_marks: number;
}

interface Attempt {
  id: string;
  exam_id: string;
  status: string;
  total_score: number | null;
  total_correct: number | null;
  submitted_at: string | null;
  exams: { title: string } | null;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamForInstructions, setSelectedExamForInstructions] = useState<Exam | null>(null);
  const [isStartingExam, setIsStartingExam] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [examsRes, attemptsRes] = await Promise.all([
        supabase.from('exams').select('*').eq('is_active', true),
        supabase.from('exam_attempts').select('*, exams(title)').eq('user_id', user.id).order('started_at', { ascending: false }),
      ]);
      if (examsRes.data) setExams(examsRes.data);
      if (attemptsRes.data) setAttempts(attemptsRes.data as Attempt[]);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleStartExamClick = (exam: Exam, hasAttempt: boolean) => {
    if (hasAttempt) {
      // If resuming, just jump straight in
      startExam(exam.id);
    } else {
      // Show instructions for a fresh attempt
      setSelectedExamForInstructions(exam);
    }
  };

  const startExam = async (examId: string) => {
    setIsStartingExam(true);
    const { data, error } = await supabase.rpc('start_or_resume_attempt', { _exam_id: examId });
    setIsStartingExam(false);
    if (error || !data) {
      toast.error(error?.message || 'Unable to start exam');
      setSelectedExamForInstructions(null);
      return;
    }
    navigate(`/exam/${data}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const submittedAttempts = attempts.filter(a => a.status === 'submitted');
  const bestScore = submittedAttempts.length > 0 ? Math.max(...submittedAttempts.map(a => a.total_score ?? 0)) : 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tests Taken</p>
                <p className="text-2xl font-heading font-bold">{submittedAttempts.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Score</p>
                <p className="text-2xl font-heading font-bold">{bestScore}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Tests</p>
                <p className="text-2xl font-heading font-bold">{exams.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Exams */}
        <div>
          <h2 className="text-xl font-heading font-bold mb-4">Available Mock Tests</h2>
          {exams.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No mock tests available yet. Check back later!</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map(exam => {
                const hasAttempt = attempts.some(a => a.exam_id === exam.id && a.status === 'in_progress');
                return (
                  <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="font-heading">{exam.title}</CardTitle>
                      {exam.description && <CardDescription>{exam.description}</CardDescription>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-3">
                        <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />{exam.duration_minutes} min</Badge>
                        <Badge variant="secondary">{exam.total_marks} marks</Badge>
                      </div>
                      <Button onClick={() => handleStartExamClick(exam, hasAttempt)} className="w-full">
                        {hasAttempt ? 'Resume Test' : 'Start Test'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Attempts */}
        {submittedAttempts.length > 0 && (
          <div>
            <h2 className="text-xl font-heading font-bold mb-4">Your Results</h2>
            <div className="space-y-3">
              {submittedAttempts.map(a => (
                <Card key={a.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/results/${a.id}`)}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{a.exams?.title ?? 'Exam'}</p>
                      <p className="text-sm text-muted-foreground">
                        {a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-heading font-bold text-primary">{a.total_score ?? 0}</p>
                      <p className="text-xs text-muted-foreground">{a.total_correct ?? 0} correct</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {/* Instructions Dialog */}
        <Dialog open={!!selectedExamForInstructions} onOpenChange={(open) => !open && setSelectedExamForInstructions(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading text-primary flex items-center gap-2">
                <Info className="w-6 h-6" /> Exam Instructions & Rules
              </DialogTitle>
              <DialogDescription>
                Please read the following instructions carefully before starting {selectedExamForInstructions?.title}.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 px-1 py-4">
              <div className="space-y-6 text-sm text-slate-700">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <h4 className="font-bold text-slate-900">Total Marks</h4>
                    <p className="text-primary font-bold">{selectedExamForInstructions?.total_marks}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Duration</h4>
                    <p className="text-primary font-bold">{selectedExamForInstructions?.duration_minutes} Mins</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Correct</h4>
                    <p className="text-green-600 font-bold">+4</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Incorrect</h4>
                    <p className="text-red-500 font-bold">-1</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-base text-slate-900 border-b pb-1">1. Format & Marking</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>The exam consists of multiple-choice questions (MCQs) with only one correct option.</li>
                    <li>For every correct answer, <strong>4 marks</strong> will be awarded.</li>
                    <li>For every incorrect answer, <strong>1 mark</strong> will be deducted.</li>
                    <li>Unanswered questions will receive <strong>0 marks</strong>.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-base text-slate-900 border-b pb-1">2. Exam Navigation</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You can jump between questions using the question palette on the right side.</li>
                    <li><strong>Save & Next:</strong> Saves your selected answer and moves to the next question.</li>
                    <li><strong>Mark for Review:</strong> Highlights the question in purple so you can revisit it later. You can mark it with or without selecting an answer.</li>
                    <li><strong>Clear Response:</strong> Removes your selected answer for the current question.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-base text-slate-900 border-b pb-1">3. General Rules</h3>
                  <ul className="list-none space-y-2">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      Do not refresh the page or press the back button while taking the test, as it may result in submission.
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      The timer at the top will continuously count down. The test will automatically submit when the time reaches zero.
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="border-t pt-4 mt-2">
              <Button variant="outline" onClick={() => setSelectedExamForInstructions(null)} disabled={isStartingExam}>
                Cancel
              </Button>
              <Button 
                onClick={() => selectedExamForInstructions && startExam(selectedExamForInstructions.id)} 
                disabled={isStartingExam}
                className="gap-2"
              >
                {isStartingExam ? 'Starting...' : <><CheckCircle2 className="w-4 h-4" /> I Agree, Start Test</>}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
