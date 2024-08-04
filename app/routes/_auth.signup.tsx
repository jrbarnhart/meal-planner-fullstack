import { ActionFunctionArgs, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { z } from "zod";
import SignupForm from "~/components/auth/signupForm";
import RouteContent from "~/components/layout/routeContent";
import { ActionError } from "~/lib/types";
import { signupFormSchema } from "~/lib/zodSchemas/authFormSchemas";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const newAccountData: z.infer<typeof signupFormSchema> = {
    name,
    email,
    password,
  };
  const zodResults = signupFormSchema.safeParse(newAccountData);

  if (!zodResults.success) {
    const errors: ActionError = zodResults.error.flatten().fieldErrors;
    return json(errors);
  }
  return;
}

export default function CreateAccount() {
  const errors = useActionData<typeof action>();
  return (
    <RouteContent>
      <SignupForm errors={errors} />
    </RouteContent>
  );
}
