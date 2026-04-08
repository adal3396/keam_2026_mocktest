import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Clock, FileText, Trophy, BarChart3, AlertCircle, CheckCircle2, Info, RefreshCw, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Exam {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  totalMarks: number;
}

interface Attempt {
  id: string;
  examId: string;
  status: string;
  totalScore: number | null;
  totalCorrect: number | null;
  submittedAt: string | null;
  exam: { title: string } | null;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExamForInstructions, setSelectedExamForInstructions] = useState<Exam | null>(null);
  const [activePopupExam, setActivePopupExam] = useState<Exam | null>(null);
  const [isStartingExam, setIsStartingExam] = useState(false);

  const studentName = user?.displayName || user?.email?.split('@')[0] || 'Student';

  const safeJson = async (resp: Response) => {
    try {
      const text = await resp.text();
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const loadData = async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);
    setError(null);

    try {
      const [examsResp, attemptsResp] = await Promise.all([
        fetch('/api/exams'),
        fetch(`/api/attempts?userId=${user.uid}`)
      ]);

      const examsData = await safeJson(examsResp);
      const attemptsData = await safeJson(attemptsResp);

      if (!examsData || !attemptsData) {
        setError('Could not connect to the server. Please ensure the app is deployed or run with "vercel dev".');
        return;
      }

      const newExams = examsData.filter((e: any) => e.isActive);
      
      setExams(prevExams => {
        // Find any exam that exists in newExams but NOT in prevExams
        if (silent && newExams.length > 0) {
          const oldExamIds = new Set(prevExams.map(e => e.id));
          const actualNewExams = newExams.filter(e => !oldExamIds.has(e.id));
          
          if (actualNewExams.length > 0) {
            console.log('Realtime discovery: New exams activated', actualNewExams);
            // Trigger the first new one found
            setActivePopupExam(actualNewExams[0]);
          }
        }
        return newExams;
      });
      setAttempts(attemptsData || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
      if (!silent) setError('Something went wrong. Please check your connection and try again.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Realtime polling for live exam activation sync
    const interval = setInterval(() => {
      console.log('Poll: Checking for new exam activations...');
      loadData(true);
    }, 5000); 
    return () => clearInterval(interval);
  }, [user]);

  const handleStartExamClick = (exam: Exam, hasAttempt: boolean) => {
    if (hasAttempt) {
      startExam(exam.id);
    } else {
      setSelectedExamForInstructions(exam);
    }
  };

  const startExam = async (examId: string) => {
    navigate(`/exam/${examId}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-heading font-bold">Unable to Load Dashboard</h2>
          <p className="text-muted-foreground text-sm">{error}</p>
          <Button onClick={() => loadData()} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      </div>
    </div>
  );

  const submittedAttempts = attempts.filter(a => a.status === 'completed');
  const bestScore = submittedAttempts.length > 0 ? Math.max(...submittedAttempts.map(a => a.totalScore ?? 0)) : 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 space-y-8">
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

        <div>
          <h2 className="text-xl font-heading font-bold mb-4">Available Mock Tests</h2>
          {exams.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No mock tests available yet. Check back later!</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map(exam => {
                const hasAttempt = attempts.some(a => a.examId === exam.id && a.status === 'started');
                return (
                  <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="font-heading">{exam.title}</CardTitle>
                      {exam.description && <CardDescription>{exam.description}</CardDescription>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-3">
                        <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />{exam.durationMinutes} min</Badge>
                        <Badge variant="secondary">{exam.totalMarks} marks</Badge>
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

        {submittedAttempts.length > 0 && (
          <div>
            <h2 className="text-xl font-heading font-bold mb-4">Your Results</h2>
            <div className="space-y-3">
              {submittedAttempts.map(a => (
                <Card key={a.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/results/${a.id}`)}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{a.exam?.title ?? 'Exam'}</p>
                      <p className="text-sm text-muted-foreground">
                        {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-heading font-bold text-primary">{a.totalScore ?? 0}</p>
                      <p className="text-xs text-muted-foreground">{a.totalCorrect ?? 0} correct</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
                    <p className="text-primary font-bold">{selectedExamForInstructions?.totalMarks}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Duration</h4>
                    <p className="text-primary font-bold">{selectedExamForInstructions?.durationMinutes} Mins</p>
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
                    <li><strong>Mark for Review:</strong> Highlights the question in purple so you can revisit it later.</li>
                    <li><strong>Clear Response:</strong> Removes your selected answer for the current question.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-base text-slate-900 border-b pb-1">3. General Rules</h3>
                  <ul className="list-none space-y-2">
                    <li className="flex items-start gap-2">
                       <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                       Do not refresh the page or press the back button while taking the test.
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
        <Dialog open={!!activePopupExam} onOpenChange={(open) => !open && setActivePopupExam(null)}>
          <DialogContent className="sm:max-w-md border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center text-primary font-heading font-bold">
                Good Luck, {studentName}!
              </DialogTitle>
              <DialogDescription className="text-center text-lg mt-2 text-foreground">
                A new KEAM Mock Test has just been activated by the administrator.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 my-2 text-center">
               <p className="font-heading font-bold text-xl">{activePopupExam?.title}</p>
               <p className="opacity-70 mt-2 font-medium">{activePopupExam?.durationMinutes} Minutes • {activePopupExam?.totalMarks} Marks</p>
            </div>
            <DialogFooter className="sm:justify-center flex-col sm:flex-row gap-3">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setActivePopupExam(null)}>
                Not Now
              </Button>
              <Button 
                className="w-full sm:w-auto shadow-lg shadow-primary/30 animate-pulse-soft gap-2" 
                onClick={() => {
                  if (activePopupExam) {
                    setActivePopupExam(null);
                    setSelectedExamForInstructions(activePopupExam);
                  }
                }}
              >
                <PlayCircle className="w-5 h-5" /> Start Test Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
