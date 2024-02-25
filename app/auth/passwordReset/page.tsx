import { passwordResetAction } from "@/app/lib/functions/auth/passwordReset";
import Main_passwordReset from "./main_passwordReset";

function Page({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {
  return (
    <Main_passwordReset
      passwordResetAction={passwordResetAction}
      error={searchParams?.error}
      message={searchParams?.message}
    />
  );
}

export default Page;
