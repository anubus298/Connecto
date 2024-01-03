import Main_finishAccount from "./main_finishAccount";
import { finishAccountAction } from "@/app/lib/functions/constructors/finishAccountInfo";
function Page({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <Main_finishAccount
      action={finishAccountAction}
      message={searchParams.message}
    />
  );
}

export default Page;
