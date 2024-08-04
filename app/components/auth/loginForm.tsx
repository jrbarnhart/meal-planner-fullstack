import { Form } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Munchlify!</CardTitle>
        <CardDescription>Existing users can log in below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" />
          </div>

          <Button type="submit">Sign Up</Button>
        </Form>
      </CardContent>
    </Card>
  );
}
