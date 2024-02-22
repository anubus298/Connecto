"use client";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";
import { Button } from "antd";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

interface Props {
  signIn: any;
  message?: string;
  error?: string;
}
function Main_signIn({ signIn, message, error }: Props) {
  const supabase = createClientComponentClient();
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button
        type="primary"
        loading={pending}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.currentTarget.form?.requestSubmit();
        }}
        className="text-white rounded-sm bg-primary"
        block
      >
        Sign In
      </Button>
    );
  }
  async function handleOauthClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // redirectTo: "https://connecto-nine.vercel.app/auth/callback",
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  }
  const isMobileScreen = useMediaQuery({
    query: "(max-width: 640px)",
  });
  return (
    <>
      {!isMobileScreen && (
        <div className="flex items-center justify-center col-start-1 col-end-7 p-4 mt-10">
          <Image
            height={500}
            width={500}
            src="https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/server/boombox.svg"
            alt="cat"
          />
        </div>
      )}
      <div className="flex flex-col items-center justify-center col-span-12 gap-5 p-4 mt-10 md:col-start-7 md:col-end-12">
        <h1 className="text-center h1 text-dark">Connect</h1>

        <form
          className="flex flex-col justify-center flex-1 gap-2 animate-in"
          action={signIn}
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="mb-6 input"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="mb-6 input"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <SubmitButton />
          <h6 className="font-semibold text-center">or</h6>
          <Button
            className="flex items-center justify-center gap-2"
            onClick={async (e: React.MouseEvent<HTMLButtonElement>) =>
              await handleOauthClick(e)
            }
          >
            <FontAwesomeIcon icon={faGoogle} />
            Sign in with Google
          </Button>
          <Link
            href={"/auth/signUp"}
            className="flex items-center justify-end w-full gap-1 text-dark"
          >
            <h6 className="text-xs">Don&lsquo;t have an account</h6>
            <FontAwesomeIcon icon={faArrowRightLong} />
          </Link>
        </form>
        <div className="w-64">
          {message && (
            <p
              className={
                "p-4 mt-4 text-center " +
                (error == "1" ? "text-red-600" : "text-primary")
              }
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Main_signIn;
