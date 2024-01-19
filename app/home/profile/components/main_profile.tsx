import { Button, ConfigProvider } from "antd";

import { Database } from "@/utils/supabase/supabase";
import Personal_bio from "./personal/personal_bio";
import Personal_cover from "./personal/personal_cover";
import Other_bio from "./other/other_bio";
import Other_cover from "./other/other_cover";
import Personal_friends from "./personal/personal_friends";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Edit_profile_section from "./personal/edit_profile_section";
export type Friends = {
  friend: {
    id: Database["public"]["Tables"]["profiles"]["Row"]["id"];
    avatar_url: Database["public"]["Tables"]["profiles"]["Row"]["avatar_url"];
    username: Database["public"]["Tables"]["profiles"]["Row"]["username"];
  };
};

interface Props {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
  personal_info?: Database["public"]["Tables"]["personal_info"]["Row"];
  is_other: boolean;
  friends: Friends[] | null;
}
function Main_profile({ profile, personal_info, is_other, friends }: Props) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Avatar: {
            containerSizeLG: 160,
            containerSize: 90,
          },
        },
      }}
    >
      <div className="grid grid-cols-12 gap-4 *:rounded-md">
        <div className="grid grid-cols-12 col-span-12 gap-1 bg-white">
          {is_other ? (
            <Other_cover profile={profile} />
          ) : (
            <Personal_cover profile={profile} />
          )}
          <div className="col-span-4 p-2">
            <Edit_profile_section />
          </div>
          <div className="flex flex-col content-center col-span-4 gap-2 ">
            <h1 className="text-center h1">{profile.username}</h1>
            {is_other ? (
              <Other_bio bio={profile.bio} />
            ) : (
              <Personal_bio bio={profile.bio} />
            )}
          </div>
          <div className="flex flex-col content-center col-span-4 gap-2 ">
            ss
          </div>
        </div>
        <div className="col-span-4 bg-secondary">khaltk</div>
        <div className="col-span-4"></div>
        <div className="col-span-4 ">
          <Personal_friends
            user_id={profile.id}
            friends={friends}
            count={profile.friends_count}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Main_profile;
