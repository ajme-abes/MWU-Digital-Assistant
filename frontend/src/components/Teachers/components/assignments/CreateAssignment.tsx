
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

export function CreateAssignment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Assignment</CardTitle>
        <CardDescription>
          Set up a new assignment for your students
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Assignment Title</Label>
          <Input id="title" placeholder="Enter assignment title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter assignment description"
            className="min-h-[100px]"
          />
        </div>
        <Button>Create Assignment</Button>
      </CardContent>
    </Card>
  );
}