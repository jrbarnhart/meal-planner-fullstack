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
import { Separator } from "../ui/separator";

export default function SignupForm({ ...props }: { errors: ActionError }) {
  const { errors } = props;
  return (
    <Card className="w-full overflow-y-auto bg-card/85 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Feel free to try the app out first.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              autoComplete="username"
            />
            {errors?.email?.map((error, index) => (
              <p className="text-destructive" key={index}>
                {error}
              </p>
            ))}
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input type="name" name="name" id="name" autoComplete="name" />
            {errors?.name?.map((error, index) => (
              <p className="text-destructive" key={index}>
                {error}
              </p>
            ))}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" id="password" />
            {errors?.password?.map((error, index) => (
              <p className="text-destructive" key={index}>
                {error}
              </p>
            ))}
          </div>
          <div className="grid gap-2">
            <Button type="submit" className="md:h-12 md:text-base">
              Create Account
            </Button>
            <Separator className="my-3" />
            <Button type="button" variant={"secondary"} asChild>
              <Link to="/" className="md:h-12 md:text-base">
                Back
              </Link>
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
