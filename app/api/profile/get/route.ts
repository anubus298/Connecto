import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/utils/supabase/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const profile_id = searchParams.get("id") as string;

  if (!profile_id) {
    return NextResponse.json({ data: null });
  }
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile_data, error: profile_data_error } = await supabase
    .from("profiles")
    .select("avatar_url,username,id")
    .eq("id", profile_id)
    .limit(1)
    .single();
  if (profile_data_error)
    return NextResponse.json({ error: profile_data_error });
  return NextResponse.json({ data: profile_data });
}
