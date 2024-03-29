import Main_post from "./components/main_post";
import { Database } from "@/utils/supabase/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { cookies } from "next/headers";
import { getMyProfile } from "../page";
import { getComments, getPost } from "@/app/lib/functions/apiFunctions";
async function Page({ searchParams }: { searchParams: { id: string } }) {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const post = await getPost(supabase, searchParams.id, user?.id);
  const comments = await getComments(
    supabase,
    searchParams.id,
    undefined,
    undefined,
    undefined,
    user?.id
  );
  const my_profile = await getMyProfile(supabase, user?.id);
  return (
    <Main_post
      //@ts-ignore
      post={post}
      //@ts-ignore
      comments={comments}
      //@ts-ignore
      my_profile={my_profile}
      //@ts-ignore
      user_id={user?.id}
    />
  );
}

export default Page;
