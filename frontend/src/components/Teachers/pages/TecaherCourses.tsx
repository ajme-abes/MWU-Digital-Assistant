
import { CoursesList } from "../components/dashboard/CoursesList";

export default function TeacherCourses() {
  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      <CoursesList />
    </div>
  );
}
