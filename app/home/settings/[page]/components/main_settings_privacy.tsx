import { cookies } from "next/headers";
import PrivacyDropdown from "./subComponents/privacyDropdown";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
import { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth, faLock, faUsers } from "@fortawesome/free-solid-svg-icons";

async function Main_settings_privacy() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("user_privacy_settings")
    .select("posts_visibility,friends_visibilty")
    .eq("user_id", user!.id)
    .returns<
      {
        posts_visibility: "public" | "private";
        friends_visibilty: "public" | "private";
      }[]
    >()
    .limit(1)
    .single();
  const postVisItems = [
    {
      label: "Only friends",
      key: "private",
      icon: <FontAwesomeIcon icon={faUsers} />,
    },
    {
      label: "Public",
      key: "public",
      icon: <FontAwesomeIcon icon={faEarth} />,
    },
  ];
  const friendVisItems = [
    {
      label: "No one",
      key: "private",
      icon: <FontAwesomeIcon icon={faLock} />,
    },
    {
      label: "Public",
      key: "public",
      icon: <FontAwesomeIcon icon={faEarth} />,
    },
  ];

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12">
        <h6 className="mb-1 h3">Privacy Settings</h6>
        <hr></hr>
      </div>
      <PrivacyDropdown
        keyForAction="posts_visibility"
        title="Who can view my posts?"
        items={postVisItems}
        initialMenuValue={
          postVisItems?.find((item) => item!.key === data!.posts_visibility)
            ?.label ?? "public"
        }
      />
      <PrivacyDropdown
        keyForAction="friends_visibilty"
        title="Who can view my friends?"
        items={friendVisItems}
        initialMenuValue={
          friendVisItems?.find((item) => item!.key === data!.friends_visibilty)
            ?.label ?? "public"
        }
      />
    </div>
  );
}

export default Main_settings_privacy;
