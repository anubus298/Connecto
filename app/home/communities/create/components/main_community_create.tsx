"use client";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ConfigProvider, Select } from "antd";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
//prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";
interface Props {
  availableLogo: string[] | undefined;
  my_profile: {
    avatar_url: any;
    username: any;
  } | null;
}
function Main_community_create({ availableLogo }: Props) {
  const [selectedFile, setselectedFile] = useState<File | null>(null);
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
      >
        Create
      </Button>
    );
  }
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <ConfigProvider theme={{}}>
      <div className="grid grid-cols-12">
        <div className="col-span-2"></div>
        <form className="grid h-screen grid-cols-12 col-span-8 p-2 rounded-md bg-primary">
          <h6 className="col-span-12 text-3xl font-semibold text-center">
            Create community
          </h6>
          <div className="flex flex-col items-center justify-center col-span-4 gap-2">
            <div className="size-[200px] relative flex items-center justify-center overflow-hidden bg-white rounded-lg ">
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
            <div className="grid w-full grid-cols-4 gap-2">
              {availableLogo &&
                availableLogo.map((logo) => {
                  return (
                    <div
                      className="col-span-1 overflow-hidden rounded-md"
                      key={logo}
                    >
                      <Image
                        src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/server/group/${logo}`}
                        height={80}
                        width={80}
                        alt=""
                      />
                    </div>
                  );
                })}
            </div>
            <input
              onChange={handleFileChange}
              type={"file"}
              name={"avatarFile"}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
          <div className="flex flex-col items-center col-span-8">
            <div className="flex flex-col w-1/2 gap-4">
              <input
                required
                className="w-full px-2 py-2"
                placeholder="Community name"
                name="name"
              />
              <Select
                className="w-full"
                placeholder="Select privacy"
                options={[
                  { label: "Public", value: "public" },
                  { label: "Private", value: "private" },
                ]}
              />
            </div>
          </div>
          <div className="col-span-12">
            <SubmitButton />
          </div>
        </form>
        <div className="col-span-2"></div>
      </div>
    </ConfigProvider>
  );
}

export default Main_community_create;
