import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import MainLayout from "./components/layout/mainLayout";
import {
  ActionFunctionArgs,
  json,
  LinksFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { commitSession, destroySession, getSession } from "./sessions";
import { prisma } from "./client";

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/favicon.svg",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userIdString = session.get("userId");
  const userId = parseInt(userIdString ?? "");
  let foundUser = null;
  if (!isNaN(userId)) {
    foundUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, id: true },
    });
  }
  return json(
    { foundUser },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
}

// Logout is handled here b/c the button is in MainLayout
export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full m-0">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full m-0 flex flex-col">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const foundUser = loaderData.foundUser;

  return (
    <MainLayout username={foundUser?.name}>
      <Outlet />
    </MainLayout>
  );
}
