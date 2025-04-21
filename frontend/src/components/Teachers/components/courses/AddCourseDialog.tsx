
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { PlusCircle } from "lucide-react";

export function AddCourseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Add New Course</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Create a new course by filling in the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Course Name</Label>
            <Input id="name" placeholder="Introduction to Computer Science" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="code">Course Code</Label>
            <Input id="code" placeholder="CS101" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="section">Section</Label>
            <Input id="section" placeholder="A" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="semester">Semester</Label>
            <Input id="semester" placeholder="Fall 2024" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
