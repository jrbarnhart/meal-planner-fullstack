import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, Link } from "@remix-run/react";
import { Label } from "../ui/label";
import { ActionError } from "~/lib/types";

export default function SignupForm({ ...props }: { errors: ActionError }) {
  const { errors } = props;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Feel free to try the app out first.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" />
            {errors?.email?.map((error, index) => (
              <p className="text-destructive" key={index}>
                {error}
              </p>
            ))}
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input type="name" name="name" />
            {errors?.name?.map((error, index) => (
              <p className="text-destructive" key={index}>
                {error}
              </p>
            ))}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" />
            {errors?.password?.map((error, index) => (
              <p className="text-destructive" key={index}>
                {error}
              </p>
            ))}
          </div>
          <div className="grid gap-2">
            <Button type="submit">Create Account</Button>
            <Link to={"/meals"}>
              <Button type="button" className="w-full">
                Try Out
              </Button>
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
