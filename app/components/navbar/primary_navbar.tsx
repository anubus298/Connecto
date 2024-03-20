import { Friend } from "@/app/home/profile/components/other/other_profile";
import { Database } from "@/utils/supabase/supabase";
import Image from "next/image";
import Link from "next/link";
import If_logged_bar from "./if_logged_bar";

export type Notification =
  Database["public"]["Tables"]["notifications"]["Row"] & {
    from: { avatar_url: string; username: string; id: string };
  };
interface Props {
  profile: {
    avatar_url: string | null;
    username: string | null;
  } | null;
  notifications: Notification[];
  numberOfUnreadedMessages: number | undefined;
  my_id?: string;
  friends: Friend[];
}

function Primary_navbar({
  profile,
  notifications,
  my_id,
  friends,
  numberOfUnreadedMessages,
}: Props) {
  return (
    <nav className="flex items-center justify-between col-span-12 px-8 py-3 border-b-2 select-none bg-white-light dark:bg-white-dark h-fit text-dark dark:text-white-light">
      <Link href={"/home"} className="flex items-center gap-1">
        <Image
          height={30}
          width={30}
          src="/svg/ofclogo.svg"
          alt="Connecto Logo"
        />
        <h3 className="text-xl font-black text-dark dark:text-white-light">
          Co<span className="text-secondary">n</span>
          <span className="text-primary">n</span>ecto
        </h3>
      </Link>

      {profile && (
        <If_logged_bar
          profile={profile}
          numberOfUnreadedMessages={numberOfUnreadedMessages}
          notifications_source={notifications}
          friends={friends}
          my_id={my_id}
        />
      )}
    </nav>
  );
}

export default Primary_navbar;
