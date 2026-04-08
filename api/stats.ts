import { db } from '../src/db/index.js';
import { exams, examAttempts, userRoles } from '../src/db/schema.js';
import { count, eq } from 'drizzle-orm';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const [examsCount, attemptsCount, studentsCount] = await Promise.all([
      db.select({ value: count() }).from(exams),
      db.select({ value: count() }).from(examAttempts).where(eq(examAttempts.status, 'completed')),
      db.select({ value: count() }).from(userRoles).where(eq(userRoles.role, 'student')),
    ]);

    return res.status(200).json({
      exams: examsCount[0].value,
      attempts: attemptsCount[0].value,
      students: studentsCount[0].value,
    });
  } catch (error: any) {
    console.error('Stats API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
