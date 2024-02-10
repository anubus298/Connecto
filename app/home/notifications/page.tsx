import { cookies } from "next/headers";

import Main_notifications from "./components/main_notifications";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
import { getNotifications } from "@/app/lib/functions/apiFunctions";

async function Page() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const notifications = await getNotifications(supabase, 0, 9, user?.id);
  return (
    <Main_notifications
      //@ts-ignore
      notifications={notifications}
    />
  );
}

export default Page;
