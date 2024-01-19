import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/utils/supabase/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get("user_id") as string;
  const from = parseInt(searchParams.get("from") as string);
  const to = parseInt(searchParams.get("to") as string);
  if (from > to || from < 0 || to < 0) {
    return NextResponse.json({
      error: "invalid query",
    });
  }
  if (!user_id) {
    return NextResponse.json({
      error: "no id",
    });
  }
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let { data: friendsRaw, error: friends_error } = await supabase
    .from("friends")
    .select(
      "user_id_1,user_id_2,friendship_id,user_1:friends_user_id_1_fkey(id,username,avatar_url),user_2:friends_user_id_2_fkey(id,username,avatar_url)"
    )
    .or(`user_id_1.eq.${user?.id},user_id_2.eq.${user?.id}`)
    .eq("status", "accepted")
    .range(from, to)
    .order("action_timestamp", { ascending: false });
  const friends = friendsRaw?.map((friend) => {
    if (friend.user_id_1 === user?.id) {
      const test = Object.fromEntries(
        Object.entries(friend).filter(([key]) => key !== "user_id_1")
      );
      test.friend = test.user_2;
      delete test["user_2"];
      delete test["user_1"];
      return test;
    } else if (friend.user_id_2 === user?.id) {
      const test = Object.fromEntries(
        Object.entries(friend).filter(([key]) => key !== "user_id_2")
      );
      test.friend = test.user_1;
      delete test["user_1"];
      delete test["user_2"];

      return test;
    }
  });

  if (friends_error) {
    return NextResponse.json({ friends_error: friends_error });
  }
  return NextResponse.json({ data: friends });
}
