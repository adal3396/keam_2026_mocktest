import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';

interface Question {
  id?: string;
  subject: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  marks: number;
  negative_marks: number;
  question_order: number;
}

type EditableQuestionField = keyof Question;

export default function ExamEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(150);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      supabase.from('exams').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setDescription(data.description || '');
          setDurationMinutes(data.duration_minutes);
        }
      });
      supabase.from('questions').select('*').eq('exam_id', id).order('question_order').then(({ data }) => {
        if (data) setQuestions(data as Question[]);
      });
    }
  }, [id, isNew]);

  const addQuestion = () => {
    setQuestions([...questions, {
      subject: 'physics',
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A',
      marks: 4,
      negative_marks: 1,
      question_order: questions.length + 1,
    }]);
  };

  const updateQuestion = (idx: number, field: EditableQuestionField, value: Question[EditableQuestionField]) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const save = async () => {
    if (!title.trim()) { toast.error('Please enter exam title'); return; }
    setSaving(true);
    try {
      const payload = questions.map((q, i) => ({
        subject: q.subject,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
        marks: q.marks,
        negative_marks: q.negative_marks,
        question_order: i + 1,
      }));

      const { error } = await supabase.rpc('upsert_exam_with_questions', {
        _exam_id: isNew ? null : id!,
        _title: title,
        _description: description,
        _duration_minutes: durationMinutes,
        _questions: payload,
      });
      if (error) throw error;

      toast.success('Exam saved!');
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save exam';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen text-foreground">
      <AppHeader />
      <main className="container py-8 max-w-4xl space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">{isNew ? 'Create New Exam' : 'Edit Exam'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="KEAM Mock Test 1" />
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" value={durationMinutes} onChange={e => setDurationMinutes(Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Full mock test covering Physics, Chemistry, and Mathematics" />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-bold">Questions ({questions.length})</h3>
          <Button variant="outline" onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-1" /> Add Question
          </Button>
        </div>

        {questions.map((q, idx) => (
          <Card key={idx} className="relative">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-heading font-bold text-muted-foreground">Q{idx + 1}</span>
                <div className="flex items-center gap-2">
                  <Select value={q.subject} onValueChange={v => updateQuestion(idx, 'subject', v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => removeQuestion(idx)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Question</Label>
                <Textarea value={q.question_text} onChange={e => updateQuestion(idx, 'question_text', e.target.value)} placeholder="Enter question text..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(['A', 'B', 'C', 'D'] as const).map(opt => (
                  <div key={opt} className="space-y-1">
                    <Label className="text-xs">Option {opt}</Label>
                    <Input
                      value={
                        opt === 'A' ? q.option_a :
                        opt === 'B' ? q.option_b :
                        opt === 'C' ? q.option_c :
                        q.option_d
                      }
                      onChange={e => updateQuestion(idx, (`option_${opt.toLowerCase()}` as EditableQuestionField), e.target.value)}
                      placeholder={`Option ${opt}`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Correct Answer</Label>
                  <Select value={q.correct_option} onValueChange={v => updateQuestion(idx, 'correct_option', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['A', 'B', 'C', 'D'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Marks</Label>
                  <Input type="number" value={q.marks} onChange={e => updateQuestion(idx, 'marks', Number(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Negative Marks</Label>
                  <Input type="number" value={q.negative_marks} onChange={e => updateQuestion(idx, 'negative_marks', Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving} size="lg">
            <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save Exam'}
          </Button>
        </div>
      </main>
    </div>
  );
}
