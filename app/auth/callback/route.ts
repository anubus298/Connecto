import { redirect } from "next/navigation";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const isReset: string | null = requestUrl.searchParams.get(
    "isReset"
  ) as string;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isReset) {
    const { data: profile, error: profile_error } = await supabase
      .from("profiles")
      .select("is_first_initialised")
      .eq("id", user?.id as string)
      .limit(1);
    const { data: personal_info, error: personal_info_error } = await supabase
      .from("personal_info")
      .select("is_first_initialised")
      .eq("id", user?.id as string)
      .limit(1);
    if (personal_info_error) {
      return redirect(
        "/auth/signIn?error=1&message=Could not authenticate user : " +
          personal_info_error.message +
          ", details :" +
          personal_info_error.details
      );
    }
    if (!profile?.[0].is_first_initialised) {
      return redirect("/constructors/newAccount");
    } else if (!personal_info?.[0].is_first_initialised) {
      return redirect("/constructors/finishAccount");
    }
    if (profile) {
      return redirect("/?islogged");
    }
    return NextResponse.redirect("/");
  } else {
    return NextResponse.redirect("/auth/passwordReset/update");
  }
}
