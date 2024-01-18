import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/utils/supabase/supabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id") as string;
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });
    const { data, error } = await supabase
      .from("comments")
      .select("*,profiles(*)")
      .eq("post_id", id);
    if (error) return NextResponse.json({ error: error });
    return NextResponse.json({ data: data });
  } catch (error: any) {
    return NextResponse.json({ error: "error" });
  }
}
