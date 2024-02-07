import { getFriends } from "@/app/home/messages/page";
import { Database } from "@/utils/supabase/supabase";
import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Primary_navbar from "./primary_navbar";
import Suspense_Primary_navbar from "./suspense/suspense_primary_navbar";

async function Server_Navbar() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
    error: user_error,
  } = await supabase.auth.getUser();
  const profile = await getProfile(supabase, user?.id as string);
  const notifications = await getNotifications(supabase, user?.id as string);
  const friends = await getFriends(supabase, user?.id);
  return (
    <Suspense fallback={<Suspense_Primary_navbar />}>
      <Primary_navbar
        profile={profile}
        //@ts-ignore
        friends={friends}
        notifications={notifications}
        my_id={user?.id}
      />
    </Suspense>
  );
}

async function getProfile(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  user_id: string
) {
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("avatar_url,username")
    .eq("id", user_id)
    .limit(1)
    .single();
  return profile;
}
async function getNotifications(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  user_id: string
) {
  const { data: notifications, error: notifications_error } = await supabase
    .from("notifications")
    .select("*,from:sender_id(avatar_url,username,id)")
    .order("updated_at", { ascending: false })
    .eq("recipient_user_id", user_id)
    .limit(7)
    .returns<any>();
  return notifications;
}
export default Server_Navbar;
