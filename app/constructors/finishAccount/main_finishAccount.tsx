"use client";
//prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";
import { Button } from "antd";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

interface Props {
  action: any;
  message?: string;
}
function Main_finishAccount({ action, message }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setselectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setselectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Clear the state if no file is selected
      setselectedFile(null);
      setImagePreview(null);
    }
  };
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
        Finish
      </Button>
    );
  }
  return (
    <div className="grid w-full grid-cols-12 col-span-12">
      <div className="flex flex-col items-center col-start-5 col-end-9 gap-6 my-auto">
        <h1 className="text-center h1">finish Your Profile</h1>
        <h6 className="text-sm text-center h6">
          You can&apos;t change username afterword
        </h6>
        <div className="size-[200px] bg-white flex justify-center items-center rounded-lg relative overflow-hidden  ">
          {imagePreview && (
            <Image height={200} width={200} alt="" src={imagePreview} />
          )}
          {!imagePreview && (
            <FontAwesomeIcon
              onClick={() => fileInputRef.current?.click()}
              icon={faPlus}
              size="2x"
              className="cursor-pointer text-dark"
            />
          )}
          {imagePreview && (
            <button
              className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 p-1 transition bg-white rounded-tl-lg cursor-pointer bg-opacity-70 hover:bg-opacity-80"
              onClick={() => fileInputRef.current?.click()}
            >
              <FontAwesomeIcon icon={faPen} />
            </button>
          )}
        </div>

        <form action={action} className="flex flex-col justify-center gap-4">
          <input
            onChange={handleFileChange}
            type={"file"}
            name={"avatarFile"}
            className="hidden"
            ref={fileInputRef}
          />
          <input
            required
            className="input"
            placeholder="username"
            name="username"
          />
          <SubmitButton />
          <p className="text-center text-red-600">{message}</p>
        </form>
      </div>
    </div>
  );
}

export default Main_finishAccount;
