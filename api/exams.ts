import { db } from './db';
import { exams, questions } from './db/schema';
import { eq, desc } from 'drizzle-orm';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const { id } = req.query;
        if (id) {
          const exam = await db.query.exams.findFirst({
            where: eq(exams.id, id as string),
            with: { questions: true }
          });
          return res.status(200).json(exam);
        }
        const allExams = await db.select().from(exams).orderBy(desc(exams.createdAt));
        return res.status(200).json(allExams);
      }

      case 'POST': {
        const { title, description, durationMinutes, totalMarks, questions: questionsData, id } = req.body;
        
        let examId = id;
        
        await db.transaction(async (tx) => {
          if (examId) {
            // Update
            await tx.update(exams).set({
              title,
              description,
              durationMinutes,
              totalMarks,
              updatedAt: new Date(),
            }).eq(exams.id, examId);
            
            // Delete old questions or update? Simpler to delete and re-insert for now
            // mimicking the RPC 'upsert_exam_with_questions' behavior if possible
            await tx.delete(questions).eq(questions.examId, examId);
          } else {
            // Create
            const [newExam] = await tx.insert(exams).values({
              title,
              description,
              durationMinutes,
              totalMarks,
            }).returning({ id: exams.id });
            examId = newExam.id;
          }

          if (questionsData && questionsData.length > 0) {
            await tx.insert(questions).values(
              questionsData.map((q: any) => ({
                ...q,
                examId: examId,
              }))
            );
          }
        });

        return res.status(200).json({ id: examId });
      }

      case 'PATCH': {
        const { id, isActive } = req.body;
        await db.update(exams).set({ isActive }).eq(exams.id, id);
        return res.status(200).json({ success: true });
      }

      case 'DELETE': {
        const { id } = req.query;
        await db.delete(exams).eq(exams.id, id as string);
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
