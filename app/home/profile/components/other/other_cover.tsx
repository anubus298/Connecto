"use client";

import Avatar_comp from "@/app/components/avatar_comp";
import { Database } from "@/utils/supabase/supabase";

import Image from "next/image";

interface Props {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
}
function Other_cover({ profile }: Props) {
  return (
    <div className="col-span-12 bg-gray-50 h-[250px] relative mb-10 ">
      <div className={"absolute z-10 w-full h-full transition "}></div>

      {profile.cover_url && (
        <Image
          className="cursor-pointer"
          src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/covers/${profile.cover_url}`}
          style={{ objectFit: "cover" }}
          fill
          alt=""
        />
      )}

      <button className="absolute z-20 flex flex-col items-center -translate-x-1/2 -bottom-8 left-1/2">
        <Avatar_comp
          className="border-2 border-white"
          size={"large"}
          src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`}
          height={150}
          width={150}
          alt={profile.username + " avatar"}
        />
      </button>
    </div>
  );
}

export default Other_cover;
