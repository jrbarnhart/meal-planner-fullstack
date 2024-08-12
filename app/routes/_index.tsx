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
    <div className="relative h-full grid grid-rows-[min-content_1fr] grid-cols-1 overflow-hidden">
      <div className="row-span-2 col-span-1 overflow-y-auto">
        <div className="grid w-full p-3 relative z-10">
          <img
            src="/titleOpt.svg"
            alt="Munchlify title"
            className="justify-self-center"
          />
          <p className="grid justify-center text-center font-bold mb-10 bg-white rounded-md bg-opacity-75 w-min justify-self-center text-nowrap p-2">
            <span className="text-xl">Welcome to Muchlify!</span>
            <span className="text-lg">{'"Meal Planning Made Easy"'}</span>
          </p>
          <LoginForm error={error} />
        </div>
      </div>
      <div
        className="row-span-2 col-span-1 absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('/splash.jpeg')" }}
      ></div>
    </div>
  );
}
