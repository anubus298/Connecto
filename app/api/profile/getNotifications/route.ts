import { getNotifications } from "@/app/lib/functions/apiFunctions";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/utils/supabase/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from") as unknown as number | undefined;
  const to = searchParams.get("to") as unknown as number | undefined;
  const cookieStore = cookies();
  try {
    if (from && to) {
      if (to - from > 10) {
        return NextResponse.json({ error: "10 max" });
      }
    }
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const data = await getNotifications(
      supabase,
      from ?? 0,
      to ?? 10,
      user?.id
    );
    return NextResponse.json({ data: data });
  } catch (error) {
    return NextResponse.json({ error: "something caused error" });
  }
}
