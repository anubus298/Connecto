import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/utils/supabase/supabase";
import { getComments } from "@/app/lib/functions/apiFunctions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") as string;
  const orderKey = searchParams.get("orderKey") as string | undefined;
  const state = searchParams.get("state") as string | undefined;
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
    const data = await getComments(
      supabase,
      id,
      {
        key: orderKey,
        status: state === "1",
      },
      from,
      to,
      user?.id
    );
    return NextResponse.json({ data: data });
  } catch (error) {}
}
