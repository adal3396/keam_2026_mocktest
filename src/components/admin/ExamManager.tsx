import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Exam {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  totalMarks: number;
  isActive: boolean;
  createdAt: string;
}

export default function ExamManager() {
  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  const loadExams = async () => {
    try {
      const data = await api.exams.list();
      if (data) setExams(data);
    } catch (err) {
      console.error('Load exams error:', err);
      toast.error('Network error loading exams.');
    }
  };

  useEffect(() => { loadExams(); }, []);

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await api.exams.toggleActive(id, active);
      setExams(prev => prev.map(e => e.id === id ? { ...e, isActive: active } : e));
      toast.success(active ? 'Exam activated — students can now take it' : 'Exam deactivated');
    } catch (err) {
      console.error('Toggle active error:', err);
      toast.error('Network error. Please try again.');
    }
  };

  const deleteExam = async (id: string) => {
    if (!confirm('Delete this exam and all its questions?')) return;
    try {
      await api.exams.delete(id);
      setExams(prev => prev.filter(e => e.id !== id));
      toast.success('Exam deleted');
    } catch (err) {
      console.error('Delete exam error:', err);
      toast.error('Network error. Please try again.');
    }
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
                  <Badge variant={exam.isActive ? 'default' : 'secondary'}>
                    {exam.isActive ? 'Active' : 'Draft'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {exam.durationMinutes} min • {exam.totalMarks} marks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={exam.isActive} onCheckedChange={(v) => toggleActive(exam.id, v)} />
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
