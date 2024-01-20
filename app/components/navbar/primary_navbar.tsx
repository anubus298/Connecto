"use client";

import Image from "next/image";
import Link from "next/link";
import If_logged_bar from "./if_logged_bar";

interface Props {
  profile?: {
    avatar_url: string | null;
    username: string | null;
  };
  avatar: string;
}
function Primary_navbar({ profile, avatar }: Props) {
  return (
    <nav className="flex items-center justify-between col-span-12 px-8 py-3 bg-white border-b-2 select-none text-dark h-fit ">
      <div className="">
        <Link href={"/"}>
          <Image
            height={50}
            width={50}
            src="/svg/logo_only_yellow_dark_stroke.svg"
            alt="Connecto Logo"
          />
        </Link>
      </div>
      {profile && <If_logged_bar avatar={avatar} profile={profile} />}
    </nav>
  );
}

export default Primary_navbar;
