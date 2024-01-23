"use client";

import { Tables } from "@/utils/supabase/supabase";

interface Props {
  conversations: NonNullable<Tables<"conversations">[]> | null;
}
function Main_messages({ conversations }: Props) {
  return (
    <div className="grid-cols-12 grid gap-2 *:rounded-md *:p-3">
      <div className="col-span-4 bg-blue-400">ss</div>
      <div className="col-span-8 bg-yellow-300">ss</div>
    </div>
  );
}

export default Main_messages;
