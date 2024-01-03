import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // if user is signed in and the current path is / redirect the user to /
  if (user && req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // if user is not signed in and the current path is not / redirect the user to /auth/signIn
  if (!user && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/auth/signIn", req.url));
  }
  if (user && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  return res;
}

export const config = {
  matcher: ["/", "/auth/:path*"],
};
