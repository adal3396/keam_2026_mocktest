import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, FileText, Trophy, AlertCircle, RefreshCw } from 'lucide-react';
import ExamManager from '@/components/admin/ExamManager';
import Leaderboard from '@/components/admin/Leaderboard';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ exams: 0, attempts: 0, students: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [exams, attempts, students] = await Promise.all([
        supabase.from('exams').select('id', { count: 'exact', head: true }),
        supabase.from('exam_attempts').select('id', { count: 'exact', head: true }).eq('status', 'submitted'),
        supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
      ]);

      if (exams.error || attempts.error || students.error) {
        const errMsg = exams.error?.message || attempts.error?.message || students.error?.message || 'Unknown error';
        console.error('Admin stats error:', errMsg);
        setError('Failed to load dashboard stats.');
      }

      setStats({
        exams: exams.count ?? 0,
        attempts: attempts.count ?? 0,
        students: students.count ?? 0,
      });
    } catch (err) {
      console.error('Admin dashboard error:', err);
      setError('Something went wrong loading the dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold">Admin Dashboard</h2>
          <Button onClick={() => navigate('/admin/exam/new')}>
            <Plus className="w-4 h-4 mr-1" /> Create Exam
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <span className="flex-1">{error}</span>
            <Button variant="outline" size="sm" onClick={loadStats} className="gap-1">
              <RefreshCw className="w-3 h-3" /> Retry
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Exams</p>
                <p className="text-2xl font-heading font-bold">{stats.exams}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submissions</p>
                <p className="text-2xl font-heading font-bold">{stats.attempts}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-heading font-bold">{stats.students}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="exams">
          <TabsList>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          <TabsContent value="exams"><ExamManager /></TabsContent>
          <TabsContent value="leaderboard"><Leaderboard /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
