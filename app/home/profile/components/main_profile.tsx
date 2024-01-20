import { ConfigProvider } from "antd";

import { Database } from "@/utils/supabase/supabase";
import Personal_bio from "./personal/personal_bio";
import Personal_cover from "./personal/personal_cover";
import Other_bio from "./other/other_bio";
import Other_cover from "./other/other_cover";
import Personal_friends from "./personal/personal_friends";

import Edit_profile_section from "./personal/edit_profile_section";
import Posts from "../../components/posts";
import Assets from "./personal/assets";
import Post_something from "../../components/post_something";
import { Post } from "../../home_main";

export type Friends = {
  friend: {
    id: Database["public"]["Tables"]["profiles"]["Row"]["id"];
    avatar_url: Database["public"]["Tables"]["profiles"]["Row"]["avatar_url"];
    username: Database["public"]["Tables"]["profiles"]["Row"]["username"];
  };
};

interface Props {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
  self_id: string | undefined;
  postAction: any;
  personal_info?: Database["public"]["Tables"]["personal_info"]["Row"];
  is_other: boolean;
  friends: Friends[] | null;
  posts: Post[];
}
function Main_profile({
  profile,
  postAction,
  personal_info,
  is_other,
  friends,
  posts,
  self_id,
}: Props) {
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
            {!is_other && <Edit_profile_section />}
          </div>
          <div className="flex flex-col col-span-12 gap-2 md:col-span-4 ">
            <h1 className="text-center h1">{profile.username}</h1>
            {is_other ? (
              <Other_bio bio={profile.bio} />
            ) : (
              <Personal_bio bio={profile.bio} />
            )}
          </div>
          <div className="flex flex-col content-center col-span-4 gap-2 "></div>
        </div>
        <Assets />
        <div className="col-span-12 md:col-span-4">
          {!is_other && (
            <Post_something
              avatar={profile.avatar_url}
              postAction={postAction}
            />
          )}
          <Posts posts={posts} user_id={self_id as string} />
        </div>
        <div className="col-span-12 md:col-span-4">
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
