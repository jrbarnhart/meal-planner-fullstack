import type { MetaFunction } from "@remix-run/node";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Munchlify!</CardTitle>
          <CardDescription>Existing users can log in below.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
