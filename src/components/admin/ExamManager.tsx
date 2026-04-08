import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_marks: number;
  is_active: boolean;
  created_at: string;
}

export default function ExamManager() {
  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  const loadExams = async () => {
    const { data } = await supabase.from('exams').select('*').order('created_at', { ascending: false });
    if (data) setExams(data);
  };

  useEffect(() => { loadExams(); }, []);

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('exams').update({ is_active: active }).eq('id', id);
    setExams(prev => prev.map(e => e.id === id ? { ...e, is_active: active } : e));
    toast.success(active ? 'Exam activated' : 'Exam deactivated');
  };

  const deleteExam = async (id: string) => {
    if (!confirm('Delete this exam and all its questions?')) return;
    await supabase.from('exams').delete().eq('id', id);
    setExams(prev => prev.filter(e => e.id !== id));
    toast.success('Exam deleted');
  };

  return (
    <div className="space-y-4 mt-4">
      {exams.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No exams yet. Create your first exam!</CardContent></Card>
      ) : (
        exams.map(exam => (
          <Card key={exam.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-heading font-semibold">{exam.title}</p>
                  <Badge variant={exam.is_active ? 'default' : 'secondary'}>
                    {exam.is_active ? 'Active' : 'Draft'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {exam.duration_minutes} min • {exam.total_marks} marks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={exam.is_active} onCheckedChange={(v) => toggleActive(exam.id, v)} />
                <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/exam/${exam.id}`)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteExam(exam.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
