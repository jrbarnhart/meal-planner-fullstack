import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { z } from "zod";
import { prisma } from "~/client";
import SignupForm from "~/components/auth/signupForm";
import { ActionError } from "~/lib/types";
import { signupFormSchema } from "~/lib/zodSchemas/authFormSchemas";
import bcrypt from "bcryptjs";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import FavIcon from "~/components/icons/favIcon";

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

  // Check if the user exists already
  const parsedEmail = zodResults.data.email;
  const userExists = await prisma.user.findUnique({
    where: { email: parsedEmail },
  });
  if (userExists) {
    const errors: ActionError = {
      email: [
        "This email is already registered to an account. Try loggin in instead.",
      ],
    };
    return json(errors);
  }

  const parsedPassword = zodResults.data.password;
  const parsedName = zodResults.data.name;
  try {
    const hashedPassword = await bcrypt.hash(parsedPassword, 10);

    const newUser = await prisma.user.create({
      data: { email: parsedEmail, name: parsedName, passHash: hashedPassword },
    });

    // Log in the new user here
    console.log(newUser);

    return redirect("/meals");
  } catch (error) {
    console.log(error);
    const errors: ActionError = {
      misc: [
        "An error occurred while creating your account. Please try again.",
      ],
    };
    return json(errors);
  }
}

export default function CreateAccount() {
  const errors = useActionData<typeof action>();
  return (
    <div className="relative h-screen flex flex-col overflow-hidden items-center">
      <div className="flex-grow flex flex-col items-center overflow-y-auto p-3 z-10 w-full">
        <div className="flex flex-col items-center space-y-4 max-w-[456px] lg:min-w-[768px]">
          <img
            src="/titleOpt.svg"
            alt="Munchlify title"
            className="w-auto h-auto hidden lg:block"
          />
          <div className="space-y-4 lg:space-y-0 lg:space-x-4 lg:grid lg:grid-flow-col lg:grid-cols-2 w-full">
            <Card className="bg-card/85 backdrop-blur-sm w-full">
              <CardHeader className="flex items-center">
                <CardTitle>Welcome new users!</CardTitle>
                <FavIcon />
              </CardHeader>
              <p className="text-center md:text-lg p-2 ">
                <span className="text-md block">
                  {
                    "Fill out the form below to create a new account! Your email is just used for identification and you will not receive messages from us."
                  }
                </span>
              </p>
            </Card>
            <SignupForm errors={errors} />
            <div className="h-[10vh]" aria-hidden />
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('/splash.jpeg')" }}
      ></div>
    </div>
  );
}
