import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
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
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

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

export function ErrorBoundary() {
  const error = useRouteError();
  const isResponse = isRouteErrorResponse(error);
  console.error(error);
  return (
    <>
      <div className="w-full flex justify-center p-8">
        <Card className="max-w-2xl flex flex-col">
          <CardHeader>
            <CardTitle>Sorry, there was an error.</CardTitle>
          </CardHeader>
          <CardContent>
            {isResponse ? (
              <div>
                <p className="text-lg">Error: {error.status}</p>
              </div>
            ) : (
              <div>
                <p className="text-lg">Error: Unknown</p>
              </div>
            )}
            <div className="flex">
              <a href="/" className="text-lg font-bold text-accent">
                {"Click to return Home."}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      <Scripts />
    </>
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
