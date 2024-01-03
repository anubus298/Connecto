export const fetchCache = "force-no-store";

import Main_newAccount from "./main_newAccount";
import { completeAccountInfoAction } from "@/app/lib/functions/constructors/completeAccountInfo";
async function Page({ searchParams }: { searchParams: { message: string } }) {
  return (
    <Main_newAccount
      action={completeAccountInfoAction}
      message={searchParams.message}
    />
  );
}

export default Page;
