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
import { FlattenedLoginFormSchemaErrors } from "~/lib/zodSchemas/authFormSchemas";

export default function LoginForm({
  ...props
}: {
  actionData: FlattenedLoginFormSchemaErrors | undefined;
}) {
  const { actionData } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Munchlify!</CardTitle>
        <CardDescription>Existing users can log in below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" />
            {actionData?.fieldErrors.email?.map((error, index) => (
              <p className="text-destructive" key={index}>
                {error}
              </p>
            ))}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" />
            {actionData?.fieldErrors.password?.map((error, index) => (
              <p className="text-destructive" key={index}>
                {error}
              </p>
            ))}
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
