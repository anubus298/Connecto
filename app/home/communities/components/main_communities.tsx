import Avatar_comp from "@/app/components/avatar_comp";
import Left_home_panel from "../../components/left_home_panel";
import Link from "next/link";
import Right_communities_panel from "./right_communities_panel";

export type PreviewGroup = {
  name: string;
  id: number;
  logo_url: string | null;
};
interface Props {
  groups:
    | {
        group: PreviewGroup;
      }[]
    | null;
}
function Main_communities({ groups }: Props) {
  return (
    <div className="grid grid-cols-12 gap-4 *:rounded-md">
      <Left_home_panel />
      <div className="col-start-3 col-end-11 p-3 bg-white ">
        <div className="">
          <h4 className="text-2xl font-semibold ">Joined</h4>
          <div className="h-[1px] bg-gray-200 w-full my-1"></div>
          <div className="flex w-full">
            {groups &&
              groups.map((group) => {
                return (
                  <Link
                    href={`/home/communities/${group.group.id}`}
                    key={group.group.id}
                    className="flex flex-col items-center"
                  >
                    <div className="size-[120px]">
                      {group.group.logo_url && (
                        <Avatar_comp
                          height={120}
                          alt={group.group.name + " logo"}
                          width={120}
                          src={group.group.logo_url}
                        />
                      )}
                    </div>
                    <h6 className="text-lg font-medium ">{group.group.name}</h6>
                  </Link>
                );
              })}
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-2xl font-semibold ">You may like</h4>
          <div className="h-[1px] bg-gray-200 w-full my-1"></div>
          <div className="flex w-full">
            {groups &&
              groups.map((group) => {
                return (
                  <Link
                    href={`/home/communities/${group.group.id}`}
                    key={group.group.id}
                    className="flex flex-col items-center"
                  >
                    <div className="size-[120px]">
                      {group.group.logo_url && (
                        <Avatar_comp
                          height={120}
                          alt={group.group.name + " logo"}
                          width={120}
                          src={group.group.logo_url}
                        />
                      )}
                    </div>
                    <h6 className="text-lg font-medium ">{group.group.name}</h6>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
      <Right_communities_panel />
    </div>
  );
}

export default Main_communities;
