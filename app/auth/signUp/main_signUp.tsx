"use client";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
interface Props {
  signUp: any;
  message?: string;
  error?: string;
}
function Main_signUp({ signUp, message, error }: Props) {
  const isMobileScreen = useMediaQuery({
    query: "(max-width: 640px)",
  });
  return (
    <>
      {!isMobileScreen && (
        <div className="col-start-1 col-end-7 p-4 mt-10">
          <Image
            items-center
            justify-betweenge
            src={"/svg/boombox.svg"}
            alt="boombox cat"
            height={500}
            width={500}
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
          <button className="px-4 py-2 mb-2 text-white rounded-sm bg-primary text-foreground">
            Sign In
          </button>
          <Link
            href={"/auth/signIn"}
            className="flex items-center justify-end w-full gap-1 text-dark"
          >
            <p>Sign In</p>
            <FontAwesomeIcon icon={faArrowRightLong} />
          </Link>
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
        </form>
      </div>
    </>
  );
}

export default Main_signUp;
