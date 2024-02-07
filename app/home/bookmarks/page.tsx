import { getBookmarks } from "@/app/lib/functions/getBookmarks";
import Main_bookmarks from "./components/main_bookmarks";
import { Database } from "@/utils/supabase/supabase";
import { Tables } from "@/utils/supabase/supabase";
import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
type Profile = {
  avatar_url: string;
  id?: string;
  username: string;
};

async function Page() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const bookmarks = await getBookmarks(supabase, 0, 3, user?.id);

  return <Main_bookmarks bookmarks={bookmarks} my_id={user?.id} />;
}

export default Page;
