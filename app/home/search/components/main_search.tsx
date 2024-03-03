"use client";

import Search_bar from "@/app/components/navbar/search_bar";
import Left_home_panel from "../../components/left_home_panel";
import Post from "../../components/post";
import { Post as PostType, Profile } from "../../home_main";
import Avatar_comp from "@/app/components/avatar_comp";
import Link from "next/link";
import { Tables } from "@/utils/supabase/supabase";
import { string } from "zod";
import Image from "next/image";

interface Props {
  search_posts: PostType[] | null;
  search_profiles: (Tables<"profiles"> & { user_id: string })[];
  my_profile: {
    avatar_url: any;
    username: any;
  };
  query?: string;
}
function Main_search({
  search_posts,
  search_profiles,
  my_profile,
  query,
}: Props) {
  return (
    <div className="col-start-3 col-end-10 p-3 bg-white dark:bg-whiteDark text-dark dark:text-white">
      <div className="w-full">
        <Search_bar init={query} className="w-full mb-2" />
      </div>
      {search_profiles && search_profiles.length > 0 && (
        <div className="my-4">
          <h6 className="text-lg font-medium ">users</h6>
          <div className="h-[1px] bg-gray-200 w-full"></div>
          <div className="flex gap-3 my-2 overflow-x-auto hide-scrollbar">
            {search_profiles.map((profile) => {
              return (
                <Link
                  href={`/home/profile?id=${profile.user_id}`}
                  className="flex flex-col items-center"
                  key={profile.username}
                >
                  <Avatar_comp
                    src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`}
                    alt={profile.username + " avatar"}
                    height={120}
                    width={120}
                  />
                  <h6 className="text-sm">{profile.username}</h6>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {search_posts && search_posts.length > 0 && (
        <div className="my-4">
          <h6 className="text-lg font-medium ">Posts</h6>
          <div className="h-[1px] bg-gray-200 w-full"></div>
          {search_posts.map((post) => {
            return (
              <Post
                key={post.id}
                post={post}
                //@ts-ignore
                my_profile={my_profile}
              />
            );
          })}
        </div>
      )}
      {search_posts?.length === 0 && search_profiles?.length === 0 && (
        <div className="flex flex-col items-center w-full mt-3 md:mt-16">
          <Image
            src={"/svg/businessman-keynote-3.svg"}
            height={160}
            width={160}
            alt=""
          />
          <h3 className="text-2xl font-medium text-center">No result</h3>
        </div>
      )}
    </div>
  );
}

export default Main_search;
