import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/utils/supabase/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from") as string;
  const to = searchParams.get("to") as string;

  if (parseInt(to) - parseInt(from) > 10) {
    return NextResponse.json({ data: null });
  }
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(
      "conversation_id,user_1:user_id_1(avatar_url,username,id),user_2:user_id_2(avatar_url,username,id)"
    )
    .or(`user_id_1.eq.${user?.id},user_id_2.eq.${user?.id}`)
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .range(parseInt(from), parseInt(to));

  const result = conversations?.map((conv) => {
    const mimic = Object.fromEntries(
      Object.entries(conv)
        .filter(([, value]) => {
          //@ts-ignore
          return value?.id !== user_id;
        })
        .map(([entryKey, entryValue]) => {
          if (entryKey === "user_1" || entryKey === "user_2") {
            return ["user_id", entryValue];
          } else {
            return [entryKey, entryValue];
          }
        })
    );
    return mimic;
  });
  if (error) {
    return NextResponse.json({ error: error });
  }
  return NextResponse.json({ data: result });
}
