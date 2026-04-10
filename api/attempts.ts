import { db } from '../src/db/index.js';
import { examAttempts, answers, questions, exams } from '../src/db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const { id, userId } = req.query;
        
        if (userId) {
          const userAttempts = await db.query.examAttempts.findMany({
            where: eq(examAttempts.userId, userId as string),
            with: { exam: true },
            orderBy: [desc(examAttempts.startedAt)]
          });
          return res.status(200).json(userAttempts);
        }

        if (!id) return res.status(400).json({ error: 'Missing attempt ID' });

        const attempt = await db.query.examAttempts.findFirst({
          where: eq(examAttempts.id, id as string),
          with: {
            exam: true,
          }
        });

        if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

        // Get review data (questions joined with answers)
        const reviewData = await db
          .select({
            questionId: questions.id,
            questionText: questions.questionText,
            optionA: questions.optionA,
            optionB: questions.optionB,
            optionC: questions.optionC,
            optionD: questions.optionD,
            correctOption: questions.correctOption,
            marks: questions.marks,
            negativeMarks: questions.negativeMarks,
            subject: questions.subject,
            selectedOption: answers.selectedOption,
          })
          .from(questions)
          .leftJoin(answers, and(eq(answers.questionId, questions.id), eq(answers.attemptId, id as string)))
          .where(eq(questions.examId, attempt.examId));

        return res.status(200).json({ attempt, review: reviewData });
      }

      case 'POST': {
        const { examId, userId } = req.body;
        
        // Start or resume attempt (simplified: always start new for now, or check existing)
        const [attempt] = await db.insert(examAttempts).values({
          examId,
          userId,
          status: 'started',
          startedAt: new Date(),
        }).returning();

        return res.status(200).json(attempt);
      }

      case 'PUT': {
        // Save an answer
        const { attemptId, questionId, selectedOption, isMarkedForReview } = req.body;
        
        const existing = await db.query.answers.findFirst({
          where: and(eq(answers.attemptId, attemptId), eq(answers.questionId, questionId))
        });

        if (existing) {
          await db.update(answers).set({
            selectedOption,
            isMarkedForReview,
            answeredAt: new Date(),
          }).where(eq(answers.id, existing.id));
        } else {
          await db.insert(answers).values({
            attemptId,
            questionId,
            selectedOption,
            isMarkedForReview,
          });
        }

        return res.status(200).json({ success: true });
      }

      case 'PATCH': {
        // Submit attempt and calculate scores
        const { id } = req.body;
        const attempt = await db.query.examAttempts.findFirst({
          where: eq(examAttempts.id, id),
        });

        if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

        const examQuestions = await db.select().from(questions).where(eq(questions.examId, attempt.examId));
        const userAnswers = await db.select().from(answers).where(eq(answers.attemptId, id));

        let totalScore = 0;
        let totalCorrect = 0;
        let totalWrong = 0;
        let totalUnanswered = 0;

        for (const q of examQuestions) {
          const ans = userAnswers.find(a => a.questionId === q.id);
          if (!ans || !ans.selectedOption) {
            totalUnanswered++;
          } else if (ans.selectedOption === q.correctOption) {
            totalCorrect++;
            totalScore += q.marks;
          } else {
            totalWrong++;
            totalScore -= q.negativeMarks;
          }
        }

        const [updated] = await db.update(examAttempts).set({
          status: 'completed',
          submittedAt: new Date(),
          totalScore,
          totalCorrect,
          totalWrong,
          totalUnanswered,
        }).where(eq(examAttempts.id, id)).returning();

        return res.status(200).json(updated);
      }

      default:
        return res.status(405).end();
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
