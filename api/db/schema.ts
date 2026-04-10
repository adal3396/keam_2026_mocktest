import { pgTable, uuid, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const appRoleEnum = pgEnum('app_role', ['admin', 'student']);
export const subjectTypeEnum = pgEnum('subject_type', ['physics', 'chemistry', 'mathematics']);

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().unique(), // Firebase UID
  fullName: text('full_name').notNull(),
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRoles = pgTable('user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  role: appRoleEnum('role').default('student').notNull(),
});

export const exams = pgTable('exams', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  durationMinutes: integer('duration_minutes').notNull().default(60),
  totalMarks: integer('total_marks').notNull().default(0),
  isActive: boolean('is_active').default(false).notNull(),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const examsRelations = relations(exams, ({ many }) => ({
  questions: many(questions),
  attempts: many(examAttempts),
}));

export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }).notNull(),
  questionText: text('question_text').notNull(),
  optionA: text('option_a').notNull(),
  optionB: text('option_b').notNull(),
  optionC: text('option_c').notNull(),
  optionD: text('option_d').notNull(),
  optionE: text('option_e'),
  correctOption: text('correct_option').notNull(),
  marks: integer('marks').default(4).notNull(),
  negativeMarks: integer('negative_marks').default(1).notNull(),
  imageUrl: text('image_url'),
  questionOrder: integer('question_order').notNull(),
  subject: subjectTypeEnum('subject').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const questionsRelations = relations(questions, ({ one }) => ({
  exam: one(exams, {
    fields: [questions.examId],
    references: [exams.id],
  }),
}));

export const examAttempts = pgTable('exam_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }).notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  submittedAt: timestamp('submitted_at'),
  status: text('status').default('started').notNull(), // 'started', 'completed'
  totalScore: integer('total_score'),
  totalCorrect: integer('total_correct'),
  totalWrong: integer('total_wrong'),
  totalUnanswered: integer('total_unanswered'),
});

export const examAttemptsRelations = relations(examAttempts, ({ one, many }) => ({
  exam: one(exams, {
    fields: [examAttempts.examId],
    references: [exams.id],
  }),
  answers: many(answers),
}));

export const answers = pgTable('answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  attemptId: uuid('attempt_id').references(() => examAttempts.id, { onDelete: 'cascade' }).notNull(),
  questionId: uuid('question_id').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  selectedOption: text('selected_option'),
  isMarkedForReview: boolean('is_marked_for_review').default(false),
  answeredAt: timestamp('answered_at').defaultNow(),
});

export const answersRelations = relations(answers, ({ one }) => ({
  attempt: one(examAttempts, {
    fields: [answers.attemptId],
    references: [examAttempts.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));
