"use client";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import React from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
interface Props {
  signUp: any;
  message?: string;
  error?: string;
}
function Main_signUp({ signUp, message, error }: Props) {
  const supabase = createClientComponentClient();
  const isMobileScreen = useMediaQuery({
    query: "(max-width: 640px)",
  });
  async function handleOauthClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV !== "production"
            ? "http://localhost:3000/auth/callback"
            : "https://connecto-nine.vercel.app/auth/callback",
      },
    });
  }
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button
        type="primary"
        loading={pending}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.currentTarget.form?.requestSubmit();
          e.currentTarget.form?.reset();
        }}
        className="text-white rounded-sm bg-primary"
        block
      >
        Sign Up
      </Button>
    );
  }
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
        <h1 className="text-center h1 text-dark">Connect To Connecto</h1>
        <form
          className="flex flex-col justify-center flex-1 gap-1 animate-in"
          action={signUp}
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="mb-4 input"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="mb-4 input"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <label className="text-md" htmlFor="password">
            Confirm Password
          </label>
          <input
            className="mb-4 input"
            type="password"
            name="confirmPassword"
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
            Sign up with Google
          </Button>
          <Link
            href={"/auth/signIn"}
            className="flex items-center justify-end w-full gap-1 mt-3 text-dark"
          >
            <h6 className="text-xs">I have an account</h6>
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

export default Main_signUp;
