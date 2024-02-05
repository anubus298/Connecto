"use client";

import Avatar_comp from "@/app/components/avatar_comp";
import { globalContext } from "@/app/lib/globalProvider";
import { Database } from "@/utils/supabase/supabase";
import { Badge, ConfigProvider } from "antd";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";

interface Props {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
}
function Other_cover({ profile }: Props) {
  const { onlineUsers, setOnlineUsers } = useContext(globalContext);
  const [is_online, setis_online] = useState(
    onlineUsers?.findIndex(
      (onlineUser) => onlineUser.friend.id === profile.id
    )! == -1
  );
  useEffect(() => {
    setis_online(
      onlineUsers?.findIndex(
        (onlineUser) => onlineUser.friend.id === profile.id
      )! !== -1
    );
  }, [onlineUsers]);
  return (
    <ConfigProvider theme={{ components: { Badge: { dotSize: 15 } } }}>
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

        <div className="absolute z-20 flex flex-col items-center -translate-x-1/2 -bottom-8 left-1/2">
          <Badge dot={is_online} status={"success"}>
            <Avatar_comp
              className="border-2 border-white"
              size={"large"}
              src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`}
              height={150}
              width={150}
              alt={profile.username + " avatar"}
            />
          </Badge>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Other_cover;
