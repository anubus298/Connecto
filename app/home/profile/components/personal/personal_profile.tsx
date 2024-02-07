import Posts from "@/app/home/components/posts";
import Post_something from "@/app/home/components/post_something";
import { Post } from "@/app/home/home_main";
import { Database } from "@/utils/supabase/supabase";
import { ConfigProvider } from "antd";
import Assets from "./assets";
import Edit_profile_section from "./edit_profile_section";
import Personal_bio from "./personal_bio";
import Personal_cover from "./personal_cover";
import Personal_friends from "./personal_friends";

type Friends = {
  friend: {
    id: Database["public"]["Tables"]["profiles"]["Row"]["id"];
    avatar_url: Database["public"]["Tables"]["profiles"]["Row"]["avatar_url"];
    username: Database["public"]["Tables"]["profiles"]["Row"]["username"];
  };
};
export type MediaUrl = {
  id: number;
  medias: string[];
  baseUrl: string;
};
interface Props {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
  self_id: string | undefined;

  personal_info: Database["public"]["Tables"]["personal_info"]["Row"];
  friends: Friends[] | null;
  posts: Post[];
  mediaUrl: MediaUrl[] | null;
}

function Personal_profile({
  profile,
  friends,
  posts,
  personal_info,
  mediaUrl,
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
          <Personal_cover profile={profile} />
          <div className="col-span-4 p-2">
            <Edit_profile_section />
          </div>
          <div className="flex flex-col col-span-12 gap-2 md:col-span-4 ">
            <h1 className="text-center h1">{profile.username}</h1>
            <Personal_bio bio={profile.bio} />
          </div>
          <div className="flex flex-col content-center col-span-4 gap-2 "></div>
        </div>
        <Assets mediaUrl={mediaUrl} />
        <div className="col-span-12 md:col-span-4">
          <Post_something avatar={profile.avatar_url} />
          <Posts
            show_small={true}
            posts={posts}
            target={self_id}
            user_id={self_id as string}
            my_profile={profile}
          />
        </div>
        <Personal_friends
          user_id={profile.id}
          friends={friends}
          count={profile.friends_count}
        />
      </div>
    </ConfigProvider>
  );
}

export default Personal_profile;
