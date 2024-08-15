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
import { commitSession, getSession } from "~/sessions";
import { Card } from "~/components/ui/card";

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
    <div className="relative h-screen flex flex-col overflow-hidden items-center">
      <div className="flex-grow overflow-y-auto p-3 z-10 ">
        <div className="flex flex-col items-center space-y-4 max-w-[456px]">
          <img
            src="/titleOpt.svg"
            alt="Munchlify title"
            className="w-auto h-auto"
          />
          <Card className="bg-card/85 backdrop-blur-sm w-full">
            <p className="text-center p-2 ">
              <span className="text-xl md:text-2xl block font-bold">
                Welcome to Muchlify!
              </span>
              <span className="text-md md:text-lg block">
                {
                  "Plan your meals effortlessly and discover new recipes—all in one place. Let's make meal planning a breeze!"
                }
              </span>
            </p>
          </Card>
          <LoginForm error={error} />
          <div className="h-[10vh]" aria-hidden />
        </div>
      </div>
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('/splash.jpeg')" }}
      ></div>
    </div>
  );
}
