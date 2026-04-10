import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, MinusCircle } from 'lucide-react';

interface AttemptSummary {
  totalScore: number | null;
  totalCorrect: number | null;
  totalWrong: number | null;
  totalUnanswered: number | null;
  exam: { title: string } | null;
}

interface ReviewQuestion {
  questionId: string;
  subject: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  imageUrl?: string;
  correctOption: string;
  selectedOption: string | null;
  marks: number;
  negativeMarks: number;
}

export default function Results() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<AttemptSummary | null>(null);
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!attemptId) return;
      try {
        const data = await api.attempts.get(attemptId);
        if (!data || !data.attempt) { navigate('/'); return; }
        
        setAttempt(data.attempt);
        setQuestions(data.review || []);
        setLoading(false);
      } catch (err) {
        console.error('Load results error:', err);
        toast.error('Failed to load results.');
        navigate('/');
      }
    };
    load();
  }, [attemptId, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const exam = attempt?.exam;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 max-w-4xl space-y-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>

        <Card className="gradient-primary text-primary-foreground">
          <CardContent className="p-8">
            <h2 className="text-2xl font-heading font-bold mb-2">{exam?.title} — Results</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm opacity-80">Score</p>
                <p className="text-3xl font-heading font-bold">{attempt?.totalScore}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Correct</p>
                <p className="text-3xl font-heading font-bold text-green-300">{attempt?.totalCorrect}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Wrong</p>
                <p className="text-3xl font-heading font-bold text-red-300">{attempt?.totalWrong}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Unanswered</p>
                <p className="text-3xl font-heading font-bold opacity-70">{attempt?.totalUnanswered}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-lg font-heading font-bold">Detailed Review</h3>

        {questions.map((q, idx) => {
          const selected = q.selectedOption;
          const isCorrect = selected === q.correctOption;
          const isUnanswered = !selected;

          return (
            <Card key={q.questionId} className={`border-l-4 ${isUnanswered ? 'border-l-muted-foreground' : isCorrect ? 'border-l-success' : 'border-l-destructive'}`}>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold">Q{idx + 1}</span>
                    <Badge variant="secondary">{q.subject}</Badge>
                    {isUnanswered ? (
                      <Badge variant="secondary"><MinusCircle className="w-3 h-3 mr-1" /> Unanswered</Badge>
                    ) : isCorrect ? (
                      <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" /> Correct</Badge>
                    ) : (
                      <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Wrong</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">+{q.marks} / -{q.negativeMarks}</span>
                </div>

                <p className="whitespace-pre-wrap">{q.questionText}</p>
                {q.imageUrl && (
                  <div className="mt-2">
                    <img src={q.imageUrl} alt="Question figure" className="max-h-48 rounded border shadow-sm" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(['A', 'B', 'C', 'D', 'E'] as const).map(opt => {
                    const isThisCorrect = q.correctOption === opt;
                    const isThisSelected = selected === opt;
                    const optText = opt === 'E' ? q.optionE : (q as any)[`option${opt}`];
                    
                    if (opt === 'E' && !optText) return null;

                    let classes = 'p-3 rounded-lg border text-sm ';
                    if (isThisCorrect) classes += 'border-success bg-success/10 font-medium';
                    else if (isThisSelected && !isThisCorrect) classes += 'border-destructive bg-destructive/10';
                    else classes += 'border-border';

                    return (
                      <div key={opt} className={classes}>
                        <span className="font-bold mr-2">{opt}.</span>
                        {optText}
                        {isThisCorrect && <CheckCircle className="w-4 h-4 inline ml-2 text-success" />}
                        {isThisSelected && !isThisCorrect && <XCircle className="w-4 h-4 inline ml-2 text-destructive" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
}
