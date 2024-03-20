import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "./utils/supabase/supabase";
export const revalidate = 0;
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user && !req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/signIn", req.url));
  }
  if (
    user &&
    req.nextUrl.pathname.startsWith("/auth") &&
    req.nextUrl.pathname !== "/auth/passwordReset/update"
  ) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (user && req.nextUrl.pathname === "/constructors/newAccount") {
    const { data: personal_info, error: personal_info_error } = await supabase
      .from("personal_info")
      .select("is_first_initialised")
      .eq("id", user.id as string);
    if (personal_info_error) {
      return NextResponse.redirect(new URL("/home", req.url));
    } else if (!personal_info[0].is_first_initialised) {
      return res;
    } else {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }
  if (user && req.nextUrl.pathname === "/constructors/finishAccount") {
    const { data: profile, error: profile_error } = await supabase
      .from("profiles")
      .select("is_first_initialised")
      .eq("id", user.id as string);
    if (profile_error) {
      return NextResponse.redirect(new URL("/home", req.url));
    } else if (!profile[0]?.is_first_initialised) {
      return res;
    } else {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }
  if (user && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  if (user && req.nextUrl.pathname === "/auth/passwordReset/update") {
    const { data } = await supabase
      .from("personal_info")
      .select("is_password_gonna_reset")
      .eq("id", user.id)
      .single();
    if (data?.is_password_gonna_reset) {
      return res;
    } else {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
