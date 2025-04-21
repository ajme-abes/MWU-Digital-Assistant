
// Mock data for the teacher dashboard
export interface Course {
  id: string;
  name: string;
  code: string;
  semester: string;
  students: number;
  section: string;
  progress: number;
  color: string;
  pendingGrading: number;
  description: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  submissions: number;
  attendance: number;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  dueDate: string;
  status: 'upcoming' | 'active' | 'past';
  submissionsCount: number;
  totalStudents: number;
}

export interface Resource {
  id: string;
  title: string;
  courseId: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  uploadDate: string;
  size?: string;
  url: string;
}

// Teacher data
export const teacherData = {
  name: 'Dr. Emily Johnson',
  department: 'Computer Science',
  title: 'Associate Professor',
  email: 'emily.johnson@university.edu',
  avatar: '',
};

// Course data
export const coursesData: Course[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    semester: 'Fall 2023',
    students: 45,
    section: 'A',
    progress: 65,
    color: '#9b87f5',
    pendingGrading: 12,
    description: 'An introduction to the fundamentals of computer science and programming.'
  },
  {
    id: '2',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    semester: 'Fall 2023',
    students: 38,
    section: 'B',
    progress: 42,
    color: '#6E59A5',
    pendingGrading: 8,
    description: 'Advanced concepts in data structures and algorithm design and analysis.'
  },
  {
    id: '3',
    name: 'Machine Learning Fundamentals',
    code: 'CS402',
    semester: 'Fall 2023',
    students: 30,
    section: 'A',
    progress: 28,
    color: '#4A3D7A',
    pendingGrading: 0,
    description: 'Introduction to machine learning concepts, algorithms, and applications.'
  },
  {
    id: '4',
    name: 'Web Development',
    code: 'CS315',
    semester: 'Fall 2023',
    students: 42,
    section: 'C',
    progress: 75,
    color: '#D6BCFA',
    pendingGrading: 22,
    description: 'Developing modern web applications using current technologies and frameworks.'
  },
];

// Students data
export const studentsData: Student[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex@university.edu', avatar: '', submissions: 8, attendance: 92 },
  { id: '2', name: 'Maria Garcia', email: 'maria@university.edu', avatar: '', submissions: 10, attendance: 98 },
  { id: '3', name: 'Jamal Williams', email: 'jamal@university.edu', avatar: '', submissions: 7, attendance: 85 },
  { id: '4', name: 'Sarah Chen', email: 'sarah@university.edu', avatar: '', submissions: 9, attendance: 94 },
  { id: '5', name: 'David Kim', email: 'david@university.edu', avatar: '', submissions: 6, attendance: 88 },
  { id: '6', name: 'Priya Patel', email: 'priya@university.edu', avatar: '', submissions: 10, attendance: 100 },
  { id: '7', name: 'James Wilson', email: 'james@university.edu', avatar: '', submissions: 5, attendance: 78 },
  { id: '8', name: 'Emma Brown', email: 'emma@university.edu', avatar: '', submissions: 8, attendance: 90 },
];

// Assignments data
export const assignmentsData: Assignment[] = [
  {
    id: '1',
    title: 'Project 1: Algorithm Implementation',
    courseId: '2',
    dueDate: '2025-04-28',
    status: 'upcoming',
    submissionsCount: 30,
    totalStudents: 38
  },
  {
    id: '2',
    title: 'Homework 3: Binary Trees',
    courseId: '2',
    dueDate: '2025-04-22',
    status: 'upcoming',
    submissionsCount: 25,
    totalStudents: 38
  },
  {
    id: '3',
    title: 'Final Project: Web Application',
    courseId: '4',
    dueDate: '2025-05-15',
    status: 'active',
    submissionsCount: 20,
    totalStudents: 42
  },
  {
    id: '4',
    title: 'Lab 5: React Components',
    courseId: '4',
    dueDate: '2025-04-25',
    status: 'upcoming',
    submissionsCount: 35,
    totalStudents: 42
  },
  {
    id: '5',
    title: 'Quiz 2: Programming Basics',
    courseId: '1',
    dueDate: '2025-04-21',
    status: 'upcoming',
    submissionsCount: 40,
    totalStudents: 45
  },
];

// Resources data
export const resourcesData: Resource[] = [
  {
    id: '1',
    title: 'Introduction to Algorithms Textbook',
    courseId: '2',
    type: 'pdf',
    uploadDate: '2025-03-10',
    size: '15.2 MB',
    url: '#'
  },
  {
    id: '2',
    title: 'Lecture Notes: Hash Tables',
    courseId: '2',
    type: 'document',
    uploadDate: '2025-03-22',
    size: '2.5 MB',
    url: '#'
  },
  {
    id: '3',
    title: 'Video Tutorial: React Basics',
    courseId: '4',
    type: 'video',
    uploadDate: '2025-04-05',
    url: '#'
  },
  {
    id: '4',
    title: 'External Resource: MDN Web Docs',
    courseId: '4',
    type: 'link',
    uploadDate: '2025-03-15',
    url: 'https://developer.mozilla.org/'
  },
  {
    id: '5',
    title: 'CS101 Course Syllabus',
    courseId: '1',
    type: 'pdf',
    uploadDate: '2025-02-02',
    size: '1.5 MB',
    url: '#'
  },
];

// Dashboard statistics
export const dashboardStats = {
  totalStudents: 155,
  upcomingDeadlines: 7,
  pendingGrading: 42,
  uploadedMaterials: 24,
};

// Navigation items
export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: 'layout-dashboard' },
  { title: 'My Courses', href: '/courses', icon: 'book-open' },
  { title: 'Upload Resources', href: '/resources', icon: 'upload' },
  { title: 'Create Assignments', href: '/assignments', icon: 'file-plus' },
  { title: 'Grade Submissions', href: '/grading', icon: 'file-check' },
  { title: 'Analytics', href: '/analytics', icon: 'chart-bar' },
  { title: 'Profile', href: '/profile', icon: 'user-round' },
];
