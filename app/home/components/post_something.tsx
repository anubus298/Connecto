"use client";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button, ConfigProvider } from "antd";
// prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";
import Image from "next/image";
import React, { ChangeEvent, useRef, useState } from "react";
interface Props {
  avatar: string | null | undefined;
  postAction: any;
}

function Post_something({ avatar, postAction }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
      >
        Post
      </Button>
    );
  }
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles([...selectedFiles, ...newFiles]);

      const newImagePreviews: string[] = [];

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImagePreviews.push(reader.result as string);

          if (newImagePreviews.length === newFiles.length) {
            setImagePreviews([...imagePreviews, ...newImagePreviews]);
          }
        };

        reader.readAsDataURL(file);
      });
    }
  };
  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...imagePreviews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Avatar: {
            containerSize: 32,
          },
        },
      }}
    >
      <div className="flex flex-col w-full gap-1 p-2 my-1 mb-6 bg-white rounded-md">
        <h4 className="font-semibold">Post Something</h4>
        <hr />
        <form action={postAction} className="flex flex-col items-end gap-2">
          <div className="flex w-full">
            <div className="rounded-full size-[40px] overflow-hidden flex justify-center items-center">
              {avatar && (
                <Avatar
                  shape="square"
                  src={
                    <Image
                      src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${avatar}`}
                      height={30}
                      width={30}
                      alt={"user avatar"}
                    />
                  }
                />
              )}
            </div>
            <input
              onChange={handleFileChange}
              type={"file"}
              name={"assets"}
              className="hidden"
              ref={fileInputRef}
              multiple
            />
            <input
              name="content"
              type={"text"}
              placeholder="What's in your mind"
              className="w-full p-1 focus-visible:outline-none"
            />

            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
            >
              <FontAwesomeIcon
                icon={faImage}
                className="text-gray-400"
                size="lg"
              />
            </button>
          </div>
          <SubmitButton />
        </form>
        {imagePreviews && (
          <div className="flex items-center gap-2">
            {imagePreviews.map((img, index) => {
              return (
                <div
                  className="relative size-[100px] overflow-hidden bg-gray-50 flex justify-center items-center"
                  key={index * 21 + 1000}
                >
                  <Image
                    className="h-auto"
                    width={95}
                    height={95}
                    alt=""
                    src={img}
                  />
                  <button
                    className="absolute top-0 left-0 "
                    onClick={() => removeFile(index)}
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}

export default Post_something;
