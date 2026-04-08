import { Question, StudentInfo } from "../types";
import { supabase } from "./supabase";

export interface SessionStart {
  sessionId: string;
  studentId: string;
}

export interface SubjectBreakdown {
  subject: "Mathematics" | "Physics" | "Chemistry";
  total: number;
  correct: number;
  wrong: number;
  unattempted: number;
  score: number;
  maxScore: number;
}

export interface SubmitResult {
  sessionId: string;
  totalScore: number;
  maxScore: number;
  correct: number;
  wrong: number;
  unattempted: number;
  percentage: number;
  timeTakenSeconds: number;
  breakdown: SubjectBreakdown[];
}

type SubjectName = SubjectBreakdown["subject"];

const subjects: SubjectName[] = ["Mathematics", "Physics", "Chemistry"];

function calculateResult(questions: Question[], answers: Record<string, number>, timeTakenSeconds: number): SubmitResult {
  const breakdown: SubjectBreakdown[] = subjects.map((subject) => {
    const subjectQuestions = questions.filter((q) => q.subject === subject);
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    let score = 0;

    for (const q of subjectQuestions) {
      const answer = answers[q.id];
      if (answer === undefined) {
        unattempted += 1;
      } else if (answer === q.correctOption) {
        correct += 1;
        score += 4;
      } else {
        wrong += 1;
        score -= 1;
      }
    }

    return {
      subject,
      total: subjectQuestions.length,
      correct,
      wrong,
      unattempted,
      score,
      maxScore: subjectQuestions.length * 4,
    };
  });

  const totalScore = breakdown.reduce((sum, b) => sum + b.score, 0);
  const maxScore = questions.length * 4;
  const correct = breakdown.reduce((sum, b) => sum + b.correct, 0);
  const wrong = breakdown.reduce((sum, b) => sum + b.wrong, 0);
  const unattempted = breakdown.reduce((sum, b) => sum + b.unattempted, 0);
  const percentage = maxScore > 0 ? Number(((totalScore / maxScore) * 100).toFixed(2)) : 0;

  return {
    sessionId: "",
    totalScore,
    maxScore,
    correct,
    wrong,
    unattempted,
    percentage,
    timeTakenSeconds,
    breakdown,
  };
}

export async function registerAndStartExam(student: StudentInfo): Promise<SessionStart> {
  const { data: existingStudent, error: studentFetchError } = await supabase
    .from("students")
    .select("id")
    .eq("roll_no", student.rollNo)
    .maybeSingle();

  if (studentFetchError) throw studentFetchError;

  let studentId = existingStudent?.id as string | undefined;

  if (!studentId) {
    const { data: insertedStudent, error: insertError } = await supabase
      .from("students")
      .insert({
        name: student.name,
        roll_no: student.rollNo,
        application_no: student.applicationNo,
        exam_center: student.examCenter,
        dob: student.dob,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;
    studentId = insertedStudent.id;
  }

  const { data: existingSession, error: existingSessionError } = await supabase
    .from("exam_sessions")
    .select("id")
    .eq("student_id", studentId)
    .eq("is_submitted", false)
    .maybeSingle();

  if (existingSessionError) throw existingSessionError;

  if (existingSession?.id) {
    return { sessionId: existingSession.id, studentId };
  }

  const { data: insertedSession, error: sessionInsertError } = await supabase
    .from("exam_sessions")
    .insert({
      student_id: studentId,
      roll_no: student.rollNo,
      answers: {},
      marked_for_review: [],
      visited: [],
      is_submitted: false,
    })
    .select("id")
    .single();

  if (sessionInsertError) throw sessionInsertError;

  return { sessionId: insertedSession.id, studentId };
}

export async function saveProgress(args: {
  sessionId: string;
  answers: Record<string, number>;
  markedForReview: string[];
  visited: string[];
}): Promise<void> {
  const { error } = await supabase
    .from("exam_sessions")
    .update({
      answers: args.answers,
      marked_for_review: args.markedForReview,
      visited: args.visited,
      updated_at: new Date().toISOString(),
    })
    .eq("id", args.sessionId)
    .eq("is_submitted", false);

  if (error) throw error;
}

export async function submitExam(args: {
  sessionId: string;
  questions: Question[];
  answers: Record<string, number>;
  markedForReview: string[];
  visited: string[];
  timeTakenSeconds: number;
}): Promise<SubmitResult> {
  const computed = calculateResult(args.questions, args.answers, args.timeTakenSeconds);

  const { error } = await supabase
    .from("exam_sessions")
    .update({
      answers: args.answers,
      marked_for_review: args.markedForReview,
      visited: args.visited,
      is_submitted: true,
      end_time: new Date().toISOString(),
      total_score: computed.totalScore,
      correct_count: computed.correct,
      wrong_count: computed.wrong,
      unattempted_count: computed.unattempted,
      time_taken_seconds: computed.timeTakenSeconds,
      math_score: computed.breakdown.find((b) => b.subject === "Mathematics")?.score ?? 0,
      physics_score: computed.breakdown.find((b) => b.subject === "Physics")?.score ?? 0,
      chemistry_score: computed.breakdown.find((b) => b.subject === "Chemistry")?.score ?? 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", args.sessionId)
    .eq("is_submitted", false);

  if (error) throw error;

  return { ...computed, sessionId: args.sessionId };
}
