import 'dotenv/config';
import { db } from '../api/db/index.js';
import { userRoles, profiles } from '../api/db/schema.js';
import { eq } from 'drizzle-orm';

async function promoteAdmin(email) {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.email, email),
    });

    if (!profile) {
      console.error(`User with email ${email} not found in profiles table.`);
      return;
    }

    console.log(`Found user: ${profile.fullName} (${profile.userId})`);

    await db.update(userRoles)
      .set({ role: 'admin' })
      .where(eq(userRoles.userId, profile.userId));

    console.log(`Successfully promoted ${email} to admin.`);
  } catch (error) {
    console.error('Promotion failed:', error);
  } finally {
    process.exit();
  }
}

promoteAdmin('adalseju@gmail.com');
