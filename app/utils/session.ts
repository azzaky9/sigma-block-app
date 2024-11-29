import { createCookieSessionStorage, redirect } from "@remix-run/node";

type SessionData = {
  userId: number;
  username: string;
  role: "admin" | "user";
};

type SessionFlashData = {
  error: string;
};

const { commitSession, destroySession, getSession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET!],
      secure: process.env.NODE_ENV === "production"
    }
  });

export async function requireUserSession(request: Request) {
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);

  if (!session.has("userId")) {
    throw redirect("/login");
  }

  return session;
}

export { getSession, commitSession, destroySession };
