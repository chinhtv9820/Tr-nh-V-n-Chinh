import { User, UserRole, StudentProfile, Opportunity, Application, ChatRoom, ChatMessage } from '../types';

// This file simulates the backend database since we cannot connect to localhost:80
// in this preview environment.

const MOCK_DELAY = 600;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- DATA STORE ---
export const mockUsers: User[] = [
  { id: '1', email: 'student@edu.com', name: 'Alice Student', role: UserRole.STUDENT },
  { id: '2', email: 'prof@edu.com', name: 'Dr. Smith', role: UserRole.PROFESSOR },
  { id: '3', email: 'admin@edu.com', name: 'Admin User', role: UserRole.ADMIN },
];

let mockProfiles: StudentProfile[] = [
  { userId: '1', fullName: 'Alice Student', major: 'Computer Science', gpa: 3.8, skills: ['React', 'Python', 'AI'], preferences: 'Research in NLP' }
];

let mockOpportunities: Opportunity[] = [
  { id: '101', title: 'AI Research Assistant', description: 'Help with NLP models.', deadline: '2024-12-31', category: 'AI/ML', professorId: '2', professorName: 'Dr. Smith' },
  { id: '102', title: 'Data Visualization Intern', description: 'Build D3 charts.', deadline: '2024-11-30', category: 'Data Science', professorId: '2', professorName: 'Dr. Smith' },
];

let mockApplications: Application[] = [
  { id: 'app1', opportunityId: '101', studentId: '1', studentName: 'Alice Student', status: 'pending' }
];

const mockChats: Record<string, ChatMessage[]> = {
  'room1': [
    { id: 'm1', senderId: '2', content: 'Hello Alice, thanks for applying.', roomId: 'room1', timestamp: Date.now() - 100000 },
    { id: 'm2', senderId: '1', content: 'Hi Dr. Smith! I am very interested.', roomId: 'room1', timestamp: Date.now() - 50000 },
  ]
};

// --- SERVICES ---

export const MockAuthService = {
  login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
    await delay(MOCK_DELAY);
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      return { user, token: 'mock-jwt-token-12345' };
    }
    throw new Error('Invalid credentials');
  },
  register: async (email: string, password: string, role: UserRole, name: string) => {
    await delay(MOCK_DELAY);
    const newUser = { id: Math.random().toString(36).substr(2, 9), email, role, name };
    mockUsers.push(newUser);
    return { user: newUser, token: 'mock-jwt-token-new' };
  }
};

export const MockProfileService = {
  get: async (userId: string) => {
    await delay(MOCK_DELAY);
    return mockProfiles.find(p => p.userId === userId) || null;
  },
  update: async (profile: StudentProfile) => {
    await delay(MOCK_DELAY);
    const index = mockProfiles.findIndex(p => p.userId === profile.userId);
    if (index >= 0) mockProfiles[index] = profile;
    else mockProfiles.push(profile);
    return profile;
  }
};

export const MockOpportunityService = {
  getAll: async () => { await delay(MOCK_DELAY); return [...mockOpportunities]; },
  getByProfessor: async (profId: string) => { await delay(MOCK_DELAY); return mockOpportunities.filter(o => o.professorId === profId); },
  create: async (opp: Opportunity) => { await delay(MOCK_DELAY); mockOpportunities.push(opp); return opp; },
  delete: async (id: string) => { await delay(MOCK_DELAY); mockOpportunities = mockOpportunities.filter(o => o.id !== id); }
};

export const MockApplicationService = {
  apply: async (app: Application) => { await delay(MOCK_DELAY); mockApplications.push(app); return app; },
  getByProfessor: async (profId: string) => { 
    await delay(MOCK_DELAY); 
    // In a real DB join, we'd filter applications by opportunities owned by this professor
    const myOppIds = mockOpportunities.filter(o => o.professorId === profId).map(o => o.id);
    return mockApplications.filter(a => myOppIds.includes(a.opportunityId));
  },
  triggerMatch: async (appId: string) => {
    await delay(1500); // Simulate Python processing
    const app = mockApplications.find(a => a.id === appId);
    if (app) {
      app.aiMatchScore = Math.floor(Math.random() * (98 - 60) + 60); // Random score 60-98
      return app;
    }
    throw new Error('Application not found');
  }
};

export const MockAdminService = {
  getStats: async () => {
    await delay(MOCK_DELAY);
    return {
      totalUsers: mockUsers.length,
      totalOpportunities: mockOpportunities.length,
      totalApplications: mockApplications.length
    };
  }
};