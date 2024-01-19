"use client";

import { Database } from "@/utils/supabase/supabase";
import { Avatar } from "antd";

import Image from "next/image";
import { useState } from "react";

interface Props {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
}
function Other_cover({ profile }: Props) {
  const [is_hovered_over_cover, setis_hovered_over_cover] = useState(false);
  return (
    <div className="col-span-12 bg-gray-200 h-[250px] relative mb-10 cursor-pointer">
      <div className={"absolute z-10 w-full h-full transition "}></div>
      <Image
        src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/covers/${profile.cover_url}`}
        style={{ objectFit: "cover" }}
        fill
        alt=""
      />
      <div className="absolute z-20 flex flex-col items-center -translate-x-1/2 -bottom-8 left-1/2">
        <Avatar
          className=""
          shape="square"
          size={"large"}
          src={
            <Image
              src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`}
              height={150}
              width={150}
              alt={profile.username + " avatar"}
            />
          }
        />
      </div>
    </div>
  );
}

export default Other_cover;
