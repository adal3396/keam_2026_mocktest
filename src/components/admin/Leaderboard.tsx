import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  email: string | null;
  total_score: number;
  total_correct: number;
}

export default function Leaderboard() {
  const [exams, setExams] = useState<{ id: string; title: string }[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase.from('exams').select('id, title').then(({ data, error }) => {
      if (error) {
        toast.error(error.message || 'Failed to load exams');
        setLoading(false);
        return;
      }
      if (data && data.length > 0) {
        setExams(data);
        setSelectedExam(data[0].id);
      }
      setLoading(false);
    });
  }, []);

  const loadLeaderboard = (silent = false) => {
    if (!selectedExam) return;
    if (!silent) setLoading(true);
    supabase.rpc('get_exam_leaderboard', { _exam_id: selectedExam, _limit: 50 }).then(({ data, error }) => {
      if (error) {
        if (!silent) toast.error(error.message || 'Failed to load leaderboard');
        setEntries([]);
        setLoading(false);
        return;
      }
      const normalized =
        (data as unknown[] | null)?.map((row) => {
          const r = row as Record<string, unknown>;
          return {
            user_id: String(r.user_id ?? ''),
            full_name: String(r.full_name ?? ''),
            email: (r.email == null ? null : String(r.email)),
            total_score: Number(r.total_score ?? 0),
            total_correct: Number(r.total_correct ?? 0),
          } satisfies LeaderboardEntry;
        }) ?? [];
      setEntries(normalized);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadLeaderboard();

    if (!selectedExam) return;

    // Realtime leaderboard updates!
    const channel = supabase
      .channel('public:exam_attempts:leaderboard')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'exam_attempts', filter: `exam_id=eq.${selectedExam}` },
        (payload) => {
          if (payload.new && (payload.new as any).status === 'submitted') {
            console.log('New submission received, updating leaderboard live!');
            loadLeaderboard(true); // Silent reload
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
            <Card key={entry.user_id} className={idx < 3 ? 'border-primary/30' : ''}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-lg bg-muted">
                  {idx < 3 ? <Trophy className={`w-5 h-5 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : 'text-orange-600'}`} /> : idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{entry.full_name || entry.email || 'Student'}</p>
                  <p className="text-sm text-muted-foreground">{entry.total_correct} correct answers</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-heading font-bold text-primary">{entry.total_score}</p>
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
