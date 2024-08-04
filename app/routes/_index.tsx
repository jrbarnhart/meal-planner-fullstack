import {
  json,
  redirect,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import LoginForm from "~/components/auth/loginForm";
import { loginFormSchema } from "~/lib/zodSchemas/authFormSchemas";

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

  const loginData = { email, password };
  const zodResults = loginFormSchema.safeParse(loginData);

  if (!zodResults.success) {
    return json(zodResults.error.flatten());
  }

  // For now just redirect on successful data parse
  return redirect("/meals");

  // Check data against db
}

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="font-sans p-4">
      <LoginForm actionData={actionData} />
    </div>
  );
}
