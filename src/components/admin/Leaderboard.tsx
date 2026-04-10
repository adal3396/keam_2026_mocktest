import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface LeaderboardEntry {
  userId: string;
  fullName: string;
  email: string | null;
  totalScore: number;
  totalCorrect: number;
}

export default function Leaderboard() {
  const [exams, setExams] = useState<{ id: string; title: string }[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.exams.list().then((data) => {
      if (data && data.length > 0) {
        setExams(data);
        setSelectedExam(data[0].id);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      toast.error('Failed to load exams');
      setLoading(false);
    });
  }, []);

  const loadLeaderboard = async () => {
    if (!selectedExam) return;
    setLoading(true);
    try {
      const resp = await fetch(`/api/leaderboard?examId=${selectedExam}`);
      const data = await resp.json();
      setEntries(data);
    } catch (err) {
      toast.error('Failed to load leaderboard');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [selectedExam]);

  return (
    <div className="space-y-4 mt-4">
      <Select value={selectedExam} onValueChange={setSelectedExam}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select exam" />
        </SelectTrigger>
        <SelectContent>
          {exams.map(e => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}
        </SelectContent>
      </Select>

      {loading ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent></Card>
      ) : entries.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No submissions yet.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <Card key={entry.userId} className={idx < 3 ? 'border-primary/30' : ''}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-lg bg-muted">
                  {idx < 3 ? <Trophy className={`w-5 h-5 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : 'text-orange-600'}`} /> : idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{entry.fullName || entry.email || 'Student'}</p>
                  <p className="text-sm text-muted-foreground">{entry.totalCorrect} correct answers</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-heading font-bold text-primary">{entry.totalScore}</p>
                  <p className="text-xs text-muted-foreground">marks</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
