import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 86400,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET ?? ""],
      secure: process.env.NODE_ENV === "production",
    },
  });

export { getSession, commitSession, destroySession };
