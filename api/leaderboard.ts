import { db } from './db';
import { examAttempts, profiles } from './db/schema';
import { eq, desc } from 'drizzle-orm';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { examId } = req.query;
  if (!examId) return res.status(400).json({ error: 'Missing examId' });

  try {
    const leaderboard = await db
      .select({
        userId: examAttempts.userId,
        fullName: profiles.fullName,
        email: profiles.email,
        totalScore: examAttempts.totalScore,
        totalCorrect: examAttempts.totalCorrect,
        submittedAt: examAttempts.submittedAt,
      })
      .from(examAttempts)
      .innerJoin(profiles, eq(profiles.userId, examAttempts.userId))
      .where(eq(examAttempts.examId, examId as string))
      .orderBy(desc(examAttempts.totalScore))
      .limit(50);

    return res.status(200).json(leaderboard);
  } catch (error: any) {
    console.error('Leaderboard API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
