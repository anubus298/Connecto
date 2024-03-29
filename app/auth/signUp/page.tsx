import { signUpAction } from "../../lib/functions/auth/signUp";
import Main_signUp from "./main_signUp";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {
  return (
    <Main_signUp
      signUp={signUpAction}
      message={searchParams?.message}
      error={searchParams?.error}
    />
  );
}
