import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { z } from "zod";
import { loginFormSchema } from "~/lib/zodSchemas/loginFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const loginForm = useForm<z.infer<typeof loginFormSchema>>({
  resolver: zodResolver(loginFormSchema),
  defaultValues: {
    username: "",
  },
});

const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
  console.log(values);
};

export default function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Munchlify!</CardTitle>
        <CardDescription>Existing users can log in below.</CardDescription>
        <CardContent></CardContent>
      </CardHeader>
    </Card>
  );
}
