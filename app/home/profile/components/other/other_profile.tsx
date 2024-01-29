import Posts from "@/app/home/components/posts";
import { Post } from "@/app/home/home_main";
import { Database, Tables } from "@/utils/supabase/supabase";
import { ConfigProvider } from "antd";
import Assets from "../personal/assets";
import Personal_friends from "../personal/personal_friends";
import Other_bio from "./other_bio";
import Other_buttons from "./other_buttons";
import Other_cover from "./other_cover";

export type Friend = {
  friend: {
    id: Tables<"profiles">["id"];
    avatar_url: Tables<"profiles">["avatar_url"];
    username: Tables<"profiles">["username"];
  };
};
interface Props {
  profile: NonNullable<Tables<"profiles">>;
  my_profile: NonNullable<Tables<"profiles">>;
  self_id: string | undefined;
  friends: Friend[] | null;
  posts: Post[];
  friendship: {
    id?: number;
    status: "added" | "sent" | "none";
    is_my_action: boolean;
  };
}
function Other_profile({
  profile,
  friends,
  posts,
  my_profile,
  self_id,
  friendship,
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
          <Other_cover profile={profile} />
          <div className="col-span-4 p-2"></div>
          <div className="flex flex-col col-span-12 gap-2 md:col-span-4 ">
            <h1 className="text-center h1">{profile.username}</h1>

            <Other_bio bio={profile.bio} />
          </div>
          <div className="flex flex-col content-center col-span-4 gap-2 "></div>
        </div>
        <Assets />
        <div className="col-span-12 md:col-span-4">
          <Other_buttons profile_id={profile.id} friendship={friendship} />
          <Posts
            posts={posts}
            user_id={self_id as string}
            my_profile={my_profile}
          />
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

export default Other_profile;
