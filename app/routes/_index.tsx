import {
  json,
  LoaderFunctionArgs,
  redirect,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/client";
import LoginForm from "~/components/auth/loginForm";
import { loginFormSchema } from "~/lib/zodSchemas/authFormSchemas";
import bcrypt from "bcryptjs";
import { z } from "zod";
import RouteContent from "~/components/layout/routeContent";
import { commitSession, getSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    return redirect("/meals");
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const loginData: z.infer<typeof loginFormSchema> = { email, password };
  const zodResults = loginFormSchema.safeParse(loginData);
  if (!zodResults.success) {
    session.flash("error", "Invalid email or password.");
    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  const { email: parsedEmail, password: parsedPassword } = zodResults.data;

  const userToLog = await prisma.user.findUnique({
    where: { email: parsedEmail },
  });
  if (!userToLog) {
    session.flash("error", "Invalid email or password.");
    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  const match = await bcrypt.compare(parsedPassword, userToLog.passHash);
  if (!match) {
    session.flash("error", "Invalid email or password.");
    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  session.set("userId", userToLog.id.toString());

  return redirect("/meals", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const error = data.error;

  return (
    <RouteContent>
      <LoginForm error={error} />
    </RouteContent>
  );
}
