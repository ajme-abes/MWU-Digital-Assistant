export interface Course {
  id: string;
  name: string;
  code: string;
  students: number;
  description: string;
  instructor: string;
  progress: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  submissions: number;
  totalStudents: number;
}

export interface Resource {
  id: string;
  courseId: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
  uploadDate: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

export const coursesData: Course[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    students: 45,
    description: 'An introductory course covering the fundamentals of computer science and programming.',
    instructor: 'Dr. Smith',
    progress: 75
  },
  {
    id: '2',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    students: 38,
    description: 'Advanced course covering fundamental data structures and algorithms.',
    instructor: 'Dr. Johnson',
    progress: 60
  }
];

export const assignmentsData: Assignment[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Programming Basics Quiz',
    dueDate: '2024-04-25',
    status: 'pending',
    submissions: 30,
    totalStudents: 45
  },
  {
    id: '2',
    courseId: '1',
    title: 'First Programming Project',
    dueDate: '2024-05-01',
    status: 'submitted',
    submissions: 42,
    totalStudents: 45
  },
  {
    id: '3',
    courseId: '2',
    title: 'Algorithm Analysis',
    dueDate: '2024-04-28',
    status: 'graded',
    submissions: 35,
    totalStudents: 38
  }
];

export const resourcesData: Resource[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Programming Fundamentals PDF',
    type: 'pdf',
    url: '/resources/programming-basics.pdf',
    uploadDate: '2024-04-15'
  },
  {
    id: '2',
    courseId: '1',
    title: 'Introduction to Python Video',
    type: 'video',
    url: '/resources/python-intro.mp4',
    uploadDate: '2024-04-16'
  },
  {
    id: '3',
    courseId: '2',
    title: 'Data Structures Guide',
    type: 'link',
    url: 'https://example.com/data-structures',
    uploadDate: '2024-04-17'
  }
];

export const studentsData: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    status: 'active'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    status: 'active'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    status: 'inactive'
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    status: 'active'
  },
  {
    id: '7',
    name: 'Robert Taylor',
    email: 'robert.taylor@example.com',
    status: 'active'
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    status: 'active'
  }
]; 