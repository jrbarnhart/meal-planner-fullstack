import type { MetaFunction } from "@remix-run/node";
import LoginForm from "~/components/auth/loginForm";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <LoginForm />
    </div>
  );
}
