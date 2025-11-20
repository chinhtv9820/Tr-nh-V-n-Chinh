export enum UserRole {
  STUDENT = 'student',
  PROFESSOR = 'professor',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  token?: string;
}

export interface StudentProfile {
  userId: string;
  fullName: string;
  major: string;
  gpa: number;
  skills: string[];
  preferences: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  category: string;
  professorId: string;
  professorName?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  studentName: string;
  status: 'pending' | 'accepted' | 'rejected';
  aiMatchScore?: number; // 0-100
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId?: string;
  content: string;
  roomId: string;
  timestamp: number;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[]; // User IDs
}