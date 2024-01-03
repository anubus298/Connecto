"use client";

import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

interface Props {
  action: any;
  message?: string;
}
function Main_finishAccount({ action, message }: Props) {
  const fileInputRed = useRef<HTMLInputElement | null>(null);
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

  return (
    <div className="grid w-full grid-cols-12 col-span-12">
      <div className="flex flex-col items-center col-start-5 col-end-9 gap-6 my-auto">
        <h1 className="text-center h1">Adjust Your Profile</h1>
        <div className="h-[200px] w-[200px] bg-gray-100 flex justify-center items-center rounded-lg relative overflow-hidden  ">
          {imagePreview && (
            <Image height={200} width={200} alt="" src={imagePreview} />
          )}
          {!imagePreview && (
            <FontAwesomeIcon
              onClick={() => fileInputRed.current?.click()}
              icon={faPlus}
              size="2x"
              className="cursor-pointer text-dark"
            />
          )}
          <div
            className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 p-1 transition bg-white rounded-tl-lg cursor-pointer bg-opacity-70 hover:bg-opacity-80"
            onClick={() => fileInputRed.current?.click()}
          >
            {imagePreview && <FontAwesomeIcon icon={faPen} />}
          </div>
        </div>

        <form action={action} className="flex flex-col justify-center gap-4">
          <input
            onChange={handleFileChange}
            type={"file"}
            name={"avatarFile"}
            className="hidden"
            ref={fileInputRed}
          />
          <input
            required
            className="input"
            placeholder="username"
            name="username"
          />
          <button className="px-4 py-2 mb-2 text-white rounded-sm bg-primary text-foreground">
            Finish
          </button>
          <p className="text-center text-red-600">{message}</p>
        </form>
      </div>
    </div>
  );
}

export default Main_finishAccount;
