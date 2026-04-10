import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { auth, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Save, ImagePlus, X } from 'lucide-react';

interface Question {
  id?: string;
  subject: 'physics' | 'chemistry' | 'mathematics';
  questionText: string;
  imageUrl?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctOption: string;
  marks: number;
  negativeMarks: number;
  questionOrder: number;
}

type EditableQuestionField = keyof Question;

const uploadImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `exam-images/${Math.random()}.${fileExt}`;
  const storageRef = ref(storage, filePath);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

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
      api.exams.get(id).then((data) => {
        if (data) {
          setTitle(data.title);
          setDescription(data.description || '');
          setDurationMinutes(data.durationMinutes);
          setQuestions(data.questions || []);
        }
      });
    }
  }, [id, isNew]);

  const addQuestion = () => {
    setQuestions([...questions, {
      subject: 'physics',
      questionText: '',
      imageUrl: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      optionE: '',
      correctOption: 'A',
      marks: 4,
      negativeMarks: 1,
      questionOrder: questions.length + 1,
    }]);
  };

  const updateQuestion = (idx: number, field: EditableQuestionField, value: any) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const uploadToast = toast.loading('Uploading image...');
    try {
      const url = await uploadImage(file);
      updateQuestion(idx, 'imageUrl', url);
      toast.success('Image uploaded', { id: uploadToast });
    } catch (err) {
      toast.error('Image upload failed', { id: uploadToast });
    }
    e.target.value = '';
  };

  const save = async () => {
    if (!title.trim()) { toast.error('Please enter exam title'); return; }
    setSaving(true);
    try {
      const payload = {
        id: isNew ? null : id,
        title,
        description,
        durationMinutes,
        totalMarks: questions.reduce((acc, q) => acc + q.marks, 0),
        questions: questions.map((q, i) => ({
          ...q,
          questionOrder: i + 1,
        })),
      };

      await api.exams.save(payload);
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
                <Textarea value={q.questionText} onChange={e => updateQuestion(idx, 'questionText', e.target.value)} placeholder="Enter question text..." />
                {q.imageUrl ? (
                  <div className="relative inline-block mt-2">
                     <img src={q.imageUrl} alt="Question" className="max-h-40 rounded border shadow-sm" />
                     <button type="button" className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:scale-105 transition-transform" onClick={() => updateQuestion(idx, 'imageUrl', '')}><X className="w-3 h-3" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <Label className="cursor-pointer flex items-center gap-2 border p-2 rounded-md hover:bg-muted/50 transition-colors text-sm text-muted-foreground">
                      <ImagePlus className="w-4 h-4" /> Add Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, idx)} />
                    </Label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(['A', 'B', 'C', 'D', 'E'] as const).map(opt => (
                  <div key={opt} className="space-y-1">
                    <Label className="text-xs">Option {opt}</Label>
                    <Input
                      value={
                        opt === 'A' ? q.optionA :
                        opt === 'B' ? q.optionB :
                        opt === 'C' ? q.optionC :
                        opt === 'D' ? q.optionD :
                        q.optionE
                      }
                      onChange={e => updateQuestion(idx, (`option${opt}` as EditableQuestionField), e.target.value)}
                      placeholder={`Option ${opt}`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Correct Answer</Label>
                  <Select value={q.correctOption} onValueChange={v => updateQuestion(idx, 'correctOption', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['A', 'B', 'C', 'D', 'E'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Marks</Label>
                  <Input type="number" value={q.marks} onChange={e => updateQuestion(idx, 'marks', Number(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Negative Marks</Label>
                  <Input type="number" value={q.negativeMarks} onChange={e => updateQuestion(idx, 'negativeMarks', Number(e.target.value))} />
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
