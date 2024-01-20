"use client";
//prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";
import { Button } from "antd";
interface Props {
  action: any;
  message: string;
}
function Main_newAccount({ action, message }: Props) {
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
        className=" text-white rounded-sm bg-primary"
        block
      >
        Proceed
      </Button>
    );
  }
  return (
    <div className="grid w-full grid-cols-12 col-span-12">
      <div className="flex flex-col col-start-5 col-end-9 gap-6 my-auto">
        <h1 className="text-center h1">Complete Your Information</h1>
        <form action={action} className="flex flex-col justify-center gap-4">
          <input
            required
            className="input"
            placeholder="full name"
            name="full_name"
          />
          <input
            required
            className="input"
            placeholder="address"
            name="address"
          />
          <input
            className="input"
            placeholder="phone number (optionally)"
            name="phone_number"
          />
          <input
            required
            className="input"
            placeholder="birthday"
            type={"date"}
            name="birthday"
          />
          <SubmitButton />
          <p className="text-center text-red-600">{message}</p>
        </form>
      </div>
    </div>
  );
}

export default Main_newAccount;
