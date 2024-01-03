"use client";

import { Database } from "@/utils/supabase/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  user: Database["public"]["Tables"]["profiles"]["Row"];
  avatar: string;
}
function Primary_navbar({ user, avatar }: Props) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between col-span-12 px-4 py-3 border-b-2 text-dark border-dark h-fit">
      <div className="">
        <p>logo here</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="rounded-3xl flex justify-center items-center h-[30px] w-[30px] overflow-hidden">
          <Image height={30} width={30} alt="avatar" src={avatar} />
        </div>
        {user?.username && <p className="font-semibold">{user.username}</p>}
        <form action={"/auth/signOut"} method="post">
          <button type="submit">sign out</button>
        </form>
      </div>
    </div>
  );
}

export default Primary_navbar;
