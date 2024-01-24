import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/utils/supabase/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const conversation_id = searchParams.get("id") as string;
  const is_ascending = searchParams.get("is_ascending") as string;
  const from = searchParams.get("from") as unknown as number;
  const to = searchParams.get("to") as unknown as number;
  if (!conversation_id) {
    return NextResponse.json({ data: null });
  }
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: messages, error: messages_error } = await supabase
    .from("messages")
    .select("*,profiles(*)")
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: is_ascending == "1" })
    .range(from, to);

  if (messages_error) return NextResponse.json({ error: messages_error });
  return NextResponse.json({ data: messages });
}
