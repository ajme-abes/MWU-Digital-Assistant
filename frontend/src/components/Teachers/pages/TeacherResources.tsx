
import { FileUpload } from "../components/resources/FileUpload";

export default function TeacherResources() {
  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Upload Resources</h1>
      <FileUpload />
    </div>
  );
}
