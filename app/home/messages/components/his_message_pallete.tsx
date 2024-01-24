import { Avatar, Image } from "antd";
import { getPrettyDate } from "../../components/post";
import { Message } from "./conversation.pallete";
interface Props {
  message: Message;
}
function His_message_pallete({ message }: Props) {
  return (
    <div className="relative flex items-stretch justify-end gap-3 px-1 py-2">
      <div className="flex flex-col max-w-[30%]">
        <div className="flex justify-end gap-2">
          <div className="flex flex-col ">
            <div className="flex flex-col items-start justify-center p-2 rounded-br-none text-dark rounded-3xl bg-secondary text ">
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
          <div className="flex items-end justify-start">
            <Avatar
              size={"small"}
              shape="square"
              src={
                <Image
                  src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${message.profiles.avatar_url}`}
                  height={24}
                  width={24}
                  alt={message.profiles.username + " avatar"}
                />
              }
            />
          </div>
        </div>
        <p className="text-xs text-gray-600 text-end">
          {getPrettyDate(message.created_at)}
        </p>
      </div>
    </div>
  );
}

export default His_message_pallete;
