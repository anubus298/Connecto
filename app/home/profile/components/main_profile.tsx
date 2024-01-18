"use client";

import { ConfigProvider } from "antd";

import { Database } from "@/utils/supabase/supabase";
import Personal_bio from "./bio";
import Cover from "./cover";

interface Props {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
  personal_info?: Database["public"]["Tables"]["personal_info"]["Row"];
}
function Main_profile({ profile, personal_info }: Props) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Avatar: {
            containerSizeLG: 160,
          },
        },
      }}
    >
      <div className="grid grid-cols-12 gap-1">
        <Cover profile={profile} />
        <div className="flex flex-col content-center col-span-12 gap-2">
          <h1 className="text-center h1">{profile.username}</h1>
          <h6 className="text-center ">( {personal_info?.full_name} )</h6>
          <Personal_bio bio={profile.bio} />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Main_profile;
