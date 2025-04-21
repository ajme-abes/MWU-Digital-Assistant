
import { Upload } from "lucide-react";
import { Button } from "../../components/ui/button";

export function FileUpload() {
  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center">
      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">Upload Course Materials</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop your files here, or click to select files
      </p>
      <Button>Select Files</Button>
    </div>
  );
}
