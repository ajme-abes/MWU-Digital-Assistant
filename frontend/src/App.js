// frontend/src/App.js
import { useEffect, useState, StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import {
  CssBaseline,
  Container,
  CircularProgress,
} from '@mui/material';
import Navigation from './components/Navigation/StudentNav';
import Signup from './components/Signup';
import SignInSide from './SignInSide';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PrivateRoute from './components/PrivateRoute';
import NotFound from "./components/Teachers/pages/NotFound";
import { Toaster } from "./components/Teachers/components/ui/toaster";
import { Toaster as Sonner } from "./components/Teachers/components/ui/sonner";
import { TooltipProvider } from "./components/Teachers/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from './components/Login';
import { jwtDecode } from 'jwt-decode';

// Teachers
import Dashboard from "./components/Teachers/pages/Dashboard";
import Courses from "./components/Teachers/pages/Courses";
import Resources from "./components/Teachers/pages/Resources";
import Assignments from "./components/Teachers/pages/Assignments";
import Grading from "./components/Teachers/pages/Grading";
import Analytics from "./components/Teachers/pages/Analytics";
import Profile from "./components/Teachers/pages/Profile";
import { ThemeProvider } from "./components/Teachers/context/ThemeContext";
import { SidebarProvider } from "./components/Teachers/context/SidebarContext";
import { MainLayout } from "./components/Teachers/components/layout/MainLayout";

// HOD
import { ThemeProviderHOD } from "./components/HOD/components/theme-providerHOD";
import { DashboardLayout } from "./components/HOD/components/layout/DashboardLayout";
import DashboardHod from "./components/HOD/pages/DashboardHod";
import CoursesHod from "./components/HOD/pages/CoursesHod";
import ResourcesHod from "./components/HOD/pages/ResourcesHod";
import Teachers from "./components/HOD/pages/Teachers";
import EnrollmentHod from "./components/HOD/pages/EnrollmentHod";
import InvitationCodes from "./components/HOD/pages/InvitationCodes";
import AnalyticsHod from "./components/HOD/pages/AnalyticsHod";
import Settings from "./components/HOD/pages/Settings";
import Logout from "./components/HOD/pages/Logout";

// Students
import DashboardStudent from "./components/Student/pages/DashboardStudent";
import CoursesStudent from "./components/Student/pages/CoursesStudent";
import AssignmentsStudent from "./components/Student/pages/AssignmentsStudent";
import GradesStudent from "./components/Student/pages/GradesStudent";
import ProfileSettings from "./components/Student/pages/ProfileSettings";
import AIAssistant from "./components/Student/pages/AIAssistant";
import StudyMaterials from "./components/Student/pages/StudyMaterials";
import Layout from "./components/Student/components/layout/Layout";

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const decoded = jwtDecode(token);
          setUser({
            email: decoded.email,
            role: decoded.role,
            department: decoded.department,
            exp: decoded.exp
          });
        }
      } catch (error) {
        console.error('Auth Check Failed:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ThemeProviderHOD>
              <SidebarProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <CssBaseline />
                    <Routes>

                      {/* Auth Routes */}
                      <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
                      <Route path="/signup" element={!user ? <Signup setUser={setUser} /> : <Navigate to="/" />} />

                      {/* HOD Routes */}
                      <Route path="/hod" element={
                        <PrivateRoute roles={['HOD']}>
                          <DashboardLayout><DashboardHod /></DashboardLayout>
                        </PrivateRoute>
                      } />
                      <Route path="/hod/courses" element={<PrivateRoute roles={['HOD']}><DashboardLayout><CoursesHod /></DashboardLayout></PrivateRoute>} />
                      <Route path="/hod/resources" element={<PrivateRoute roles={['HOD']}><DashboardLayout><ResourcesHod /></DashboardLayout></PrivateRoute>} />
                      <Route path="/hod/teachers" element={<PrivateRoute roles={['HOD']}><DashboardLayout><Teachers /></DashboardLayout></PrivateRoute>} />
                      <Route path="/hod/enrollment" element={<PrivateRoute roles={['HOD']}><DashboardLayout><EnrollmentHod /></DashboardLayout></PrivateRoute>} />
                      <Route path="/hod/invitations" element={<PrivateRoute roles={['HOD']}><DashboardLayout><InvitationCodes /></DashboardLayout></PrivateRoute>} />
                      <Route path="/hod/analytics" element={<PrivateRoute roles={['HOD']}><DashboardLayout><AnalyticsHod /></DashboardLayout></PrivateRoute>} />
                      <Route path="/hod/settings" element={<PrivateRoute roles={['HOD']}><DashboardLayout><Settings /></DashboardLayout></PrivateRoute>} />
                      <Route path="/hod/logout" element={<PrivateRoute roles={['HOD']}><Logout /></PrivateRoute>} />

                      {/* Teacher Routes */}
                      <Route path="/teacher" element={<PrivateRoute roles={['TEACHER']}><MainLayout><Dashboard /></MainLayout></PrivateRoute>} />
                      <Route path="/teacher/courses" element={<PrivateRoute roles={['TEACHER']}><MainLayout><Courses /></MainLayout></PrivateRoute>} />
                      <Route path="/teacher/resources" element={<PrivateRoute roles={['TEACHER']}><MainLayout><Resources /></MainLayout></PrivateRoute>} />
                      <Route path="/teacher/assignments" element={<PrivateRoute roles={['TEACHER']}><MainLayout><Assignments /></MainLayout></PrivateRoute>} />
                      <Route path="/teacher/grading" element={<PrivateRoute roles={['TEACHER']}><MainLayout><Grading /></MainLayout></PrivateRoute>} />
                      <Route path="/teacher/analytics" element={<PrivateRoute roles={['TEACHER']}><MainLayout><Analytics /></MainLayout></PrivateRoute>} />
                      <Route path="/teacher/profile" element={<PrivateRoute roles={['TEACHER']}><MainLayout><Profile /></MainLayout></PrivateRoute>} />

                      {/* Student Routes */}
                      <Route path="/student" element={<PrivateRoute roles={['STUDENT']}><Layout><DashboardStudent /></Layout></PrivateRoute>} />
                      <Route path="/student/courses" element={<PrivateRoute roles={['STUDENT']}><Layout><CoursesStudent /></Layout></PrivateRoute>} />
                      <Route path="/student/assignments" element={<PrivateRoute roles={['STUDENT']}><Layout><AssignmentsStudent /></Layout></PrivateRoute>} />
                      <Route path="/student/grades" element={<PrivateRoute roles={['STUDENT']}><Layout><GradesStudent /></Layout></PrivateRoute>} />
                      <Route path="/student/profile" element={<PrivateRoute roles={['STUDENT']}><Layout><ProfileSettings /></Layout></PrivateRoute>} />
                      <Route path="/student/ai" element={<PrivateRoute roles={['STUDENT']}><Layout><AIAssistant /></Layout></PrivateRoute>} />
                      <Route path="/student/materials" element={<PrivateRoute roles={['STUDENT']}><Layout><StudyMaterials /></Layout></PrivateRoute>} />

                      {/* Root redirect based on role */}
                      <Route path="/" element={
                        !user ? <Navigate to="/login" /> :
                          user.role === 'HOD' ? <Navigate to="/hod" /> :
                          user.role === 'TEACHER' ? <Navigate to="/teacher" /> :
                          <Navigate to="/student" />
                      } />

                      {/* 404 Not Found */}
                      <Route path="*" element={<NotFound />} />

                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </SidebarProvider>
            </ThemeProviderHOD>
          </ThemeProvider>
        </QueryClientProvider>
      </StrictMode>
    </GoogleOAuthProvider>
  );
}

export default App;
