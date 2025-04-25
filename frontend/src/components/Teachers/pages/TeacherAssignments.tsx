
import { CreateAssignment } from "../components/assignments/CreateAssignment";

export default function TeacherAssignments() {
  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Create Assignments</h1>
      <CreateAssignment />
    </div>
  );
}
