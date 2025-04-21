// frontend/src/App.js
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import {
  CssBaseline,
  Container,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';

// Components
import Navigation from './components/Navigation/StudentNav';
import Signup from './components/Signup';
import SignInSide from './SignInSide';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PrivateRoute from './components/PrivateRoute';
import HODDashboard from './components/HODDashboard';
//teachers path
import { Toaster } from "./components/Teachers/components/ui/toaster";
import { Toaster as Sonner } from "./components/Teachers/components/ui/sonner";
import { TooltipProvider } from "./components/Teachers/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./components/Teachers/pages/Dashboard";
import Courses from "./components/Teachers/pages/Courses";
import Resources from "./components/Teachers/pages/Resources";
import Assignments from "./components/Teachers/pages/Assignments";
import Grading from "./components/Teachers/pages/Grading";
import Analytics from "./components/Teachers/pages/Analytics";
import Profile from "./components/Teachers/pages/Profile";
import NotFound from "./components/Teachers/pages/NotFound";
import { ThemeProvider } from "./components/Teachers/context/ThemeContext";
import { SidebarProvider } from "./components/Teachers/context/SidebarContext";
import { MainLayout } from "./components/Teachers/components/layout/MainLayout";
import { StrictMode } from "react";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  //const location = useLocation();


  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:8000/api/auth/user/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   setUser(null);
  //   return <Navigate to="/login" />;
  // };

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
          <SidebarProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
               <BrowserRouter>
                <CssBaseline />
                {user && <Navigation user={user} setUser={setUser} />}
        
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={
              !user ? (
                <Navigate to="/login" />
              ) : user.role === 'STUDENT' ? (
                <Navigate to="/dashboard" />
              ) : user.role === 'TEACHER' ? (
                <Navigate to="/courses" />
              ) : user.role === 'HOD' ? (
                <Navigate to="/department" />
              ) : (
                <Navigate to="/login" />
              )
            } />

            {/* Auth Routes */}
            <Route path="/login" element={
              !user ? <SignInSide setUser={setUser} /> : <Navigate to="/" />
            } />
            <Route path="/signup" element={
              !user ? <Signup setUser={setUser} /> : <Navigate to="/" />
            } />

            {/* Student Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute roles={['STUDENT']}>
                <StudentDashboard />
              </PrivateRoute>
              }>
              {/* <Route index element={<CourseOverview />} />
              <Route path="courses" element={<EnrolledCourses />} />
              <Route path="assignments" element={<StudentAssignments />} />
              <Route path="grades" element={<StudentGrades />} /> */}
            </Route>

            {/* Teacher Routes */}
            <Route path="/courses/*" element={
              <PrivateRoute roles={['TEACHER']}>
                <MainLayout>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="resources" element={<Resources />} />
                    <Route path="assignments" element={<Assignments />} />
                    <Route path="grading" element={<Grading />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
              </PrivateRoute>
            } />

            {/* HOD Routes */}
            <Route path="/department" element={
              <PrivateRoute roles={['HOD']}>
                <HODDashboard />
              </PrivateRoute>
              }>
              {/* <Route index element={<DepartmentOverview />} />
              <Route path="courses" element={<DepartmentCourses />} />
              <Route path="faculty" element={<FacultyManagement />} />
              <Route path="approvals" element={<ResourceApprovals />} />
              <Route path="analytics" element={<DepartmentAnalytics />} /> */}
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </BrowserRouter>
      </TooltipProvider>
          </SidebarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
    </GoogleOAuthProvider>
  );
}

export default App;