import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const authRoutes = ["/login", "/register"];

  // Logged in user should not access login/register
//   if (token && authRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

  // Unauthenticated user accessing protected routes
  if (
    !token &&
    !authRoutes.includes(pathname) &&
    !pathname.startsWith("/api/auth")
  ) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};