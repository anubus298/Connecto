"use client";
import Avatar_comp from "@/app/components/avatar_comp";
import { getPrettyDate } from "../../components/post";
import { Message } from "./conversation.pallete";
interface Props {
  message: Message;
}
function My_message_pallete({ message }: Props) {
  return (
    <div className="relative flex items-stretch justify-start gap-3 px-1 py-2">
      <div className="flex flex-col md:max-w-[30%] max-w-[60%]">
        <div className="flex gap-2">
          <div className="flex items-end justify-start">
            <Avatar_comp
              size={"small"}
              src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${message.profiles.avatar_url}`}
              height={24}
              width={24}
              className="h-auto"
              alt={message.profiles.username + " avatar"}
            />
          </div>
          <div className="flex flex-col ">
            <div className="flex flex-col items-start justify-center p-2 text-white rounded-bl-none rounded-3xl bg-primary text ">
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 text-start">
          {getPrettyDate(message.created_at)}
        </p>
      </div>
    </div>
  );
}

export default My_message_pallete;
