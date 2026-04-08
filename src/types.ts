export type Subject = 'Physics' | 'Chemistry' | 'Mathematics';

export interface Question {
  id: string;
  subject: Subject;
  questionNo: number;
  questionText: string;
  options: string[]; // always 5 options for KEAM
  correctOption: number; // 0-indexed
  explanation?: string;
}

export interface ExamSession {
  id: string;
  startTime: number;
  endTime?: number;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  markedForReview: Set<string>;
  visited: Set<string>;
  status: 'ongoing' | 'submitted';
}

export type QuestionStatus =
  | 'not-visited'    // grey
  | 'not-answered'   // red
  | 'answered'       // green
  | 'marked'         // purple (marked for review, not answered)
  | 'answered-marked'; // purple with tick (answered + marked for review)

export interface StudentInfo {
  name: string;
  rollNo: string;
  applicationNo: string;
  examCenter: string;
  dob: string;
}
