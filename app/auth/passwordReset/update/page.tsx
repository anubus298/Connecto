import { passwordResetUpdateAction } from "@/app/lib/functions/auth/passwordResetUpdate";
import { Button } from "antd";

function Page({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen col-span-12 gap-1 p-4 mt-10 md:col-start-6 md:col-end-8">
      <h1 className="mb-8 text-center h1 text-dark">Update Password</h1>
      <div className="">
        <form
          className="flex flex-col justify-center flex-1 gap-2 animate-in"
          action={passwordResetUpdateAction}
        >
          <label className="text-md" htmlFor="email">
            New Password
          </label>
          <input className="mb-6 input" name="password" required />

          <Button
            htmlType="submit"
            type="primary"
            className="text-white rounded-sm bg-primary"
            block
          >
            Update
          </Button>
        </form>
      </div>
      <div className="w-64">
        {searchParams.message && (
          <p
            className={
              "p-4 mt-4 text-center " +
              (searchParams.error == "1" ? "text-red-600" : "text-primary")
            }
          >
            {searchParams.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Page;
