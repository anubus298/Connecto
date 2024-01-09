import { signInAction } from "../../lib/functions/auth/signIn";
import Main_signIn from "./main_signIn";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {
  return (
    <Main_signIn
      error={searchParams?.error}
      signIn={signInAction}
      message={searchParams?.message}
    />
  );
}
