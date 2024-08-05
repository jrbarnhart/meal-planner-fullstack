import { Form, Link } from "@remix-run/react";
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

export default function LoginForm({ ...props }: { error: string | undefined }) {
  const { error } = props;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome to Munchlify!</CardTitle>
        <CardDescription>Existing users can log in below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" />
            {error && <p className="text-destructive">{error}</p>}
          </div>

          <div className="grid gap-2">
            <Button type="submit">Log In</Button>
            <Link to={"/signup"}>
              <Button type="button" variant={"secondary"} className="w-full">
                Sign Up
              </Button>
            </Link>
            <Link to={"/meals"}>
              <Button type="button" variant={"secondary"} className="w-full">
                Try Out
              </Button>
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
