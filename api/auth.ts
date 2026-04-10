import { db } from '../src/db/index.js';
import { profiles, userRoles } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'Missing userId' });

        const profile = await db.query.profiles.findFirst({
          where: eq(profiles.userId, userId as string),
        });

        const roleEntry = await db.query.userRoles.findFirst({
          where: eq(userRoles.userId, userId as string),
        });

        return res.status(200).json({ 
          profile, 
          role: roleEntry?.role || 'student' 
        });
      }

      case 'POST': {
        const { userId, fullName, email, role } = req.body;
        
        // Upsert profile
        const existingProfile = await db.query.profiles.findFirst({
          where: eq(profiles.userId, userId),
        });

        if (existingProfile) {
          await db.update(profiles)
            .set({ fullName, email, updatedAt: new Date() })
            .where(eq(profiles.userId, userId));
        } else {
          await db.insert(profiles).values({ userId, fullName, email });
        }

        // Upsert role
        const existingRole = await db.query.userRoles.findFirst({
          where: eq(userRoles.userId, userId),
        });

        if (!existingRole) {
          await db.insert(userRoles).values({ 
            userId, 
            role: role || 'student' 
          });
        }

        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).end();
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
