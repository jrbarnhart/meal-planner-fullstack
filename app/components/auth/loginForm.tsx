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
import PreviewButton from "./previewButton";
import { Separator } from "../ui/separator";

export default function LoginForm({ ...props }: { error: string | undefined }) {
  const { error } = props;
  return (
    <Card className="w-full bg-card/85 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Existing users can log in below.</CardDescription>
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
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" id="password" />
            {error && <p className="text-destructive">{error}</p>}
          </div>

          <div className="grid gap-2">
            <Button type="submit" className="md:h-12 md:text-base">
              Log In
            </Button>
            <Separator />
            <p className="text-sm text-center">
              New user? Signup or Preview the site:
            </p>
            <Button
              type="button"
              variant={"secondary"}
              className="w-full"
              asChild
            >
              <Link to={"/signup"} className="md:h-12 md:text-base">
                Sign Up
              </Link>
            </Button>
            <PreviewButton />
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
