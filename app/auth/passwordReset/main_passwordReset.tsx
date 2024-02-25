"use client";
import { Button } from "antd";
import Link from "next/link";
//prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";
interface Props {
  passwordResetAction: any;
  error?: string;
  message?: string;
}
function Main_passwordReset({ passwordResetAction, error, message }: Props) {
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
        Reset
      </Button>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen col-span-12 gap-1 p-4 mt-10 md:col-start-6 md:col-end-8">
      <h1 className="text-center h1 text-dark">Reset Password</h1>
      <form
        className="flex flex-col justify-center flex-1 gap-2 animate-in"
        action={passwordResetAction}
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

        <SubmitButton />
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
  );
}

export default Main_passwordReset;
