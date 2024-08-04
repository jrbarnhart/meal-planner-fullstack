import {
  json,
  redirect,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { prisma } from "~/client";
import LoginForm from "~/components/auth/loginForm";
import { ActionError } from "~/lib/types";
import { loginFormSchema } from "~/lib/zodSchemas/authFormSchemas";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const loginData: z.infer<typeof loginFormSchema> = { email, password };
  const zodResults = loginFormSchema.safeParse(loginData);
  if (!zodResults.success) {
    const errors: ActionError = zodResults.error.flatten().fieldErrors;
    return json(errors);
  }

  const { email: parsedEmail } = zodResults.data;
  const userToLog = await prisma.user.findUnique({
    where: { email: parsedEmail },
  });
  if (!userToLog) {
    const errors: ActionError = {
      email: ["No account with that email exists."],
    };
    return json(errors);
  }

  const { password: parsedPassword } = zodResults.data;

  const match = await bcrypt.compare(parsedPassword, userToLog.passHash);

  if (!match) {
    const errors: ActionError = { password: ["Invalid password"] };
    return json(errors);
  }

  return redirect("/meals"); // Change to login logic
}

export default function Index() {
  const errors = useActionData<typeof action>();

  return (
    <div className="font-sans p-4">
      <LoginForm errors={errors} />
    </div>
  );
}
