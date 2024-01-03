import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("is_first_initialised")
    .eq("id", user?.id as string);
  const { data: personal_info, error: personal_info_error } = await supabase
    .from("personal_info")
    .select("is_first_initialised")
    .eq("id", user?.id as string);
  if (personal_info_error) {
    return redirect("/auth/signIn?error=1&message=Could not authenticate user");
  }
  if (!profile?.[0].is_first_initialised) {
    return redirect("/constructors/newAccount");
  } else if (!personal_info?.[0].is_first_initialised) {
    return redirect("/constructors/finishAccount");
  }
  if (profile) return redirect("/?islogged");
  return NextResponse.redirect(requestUrl.origin);
}
