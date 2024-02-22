"use client";
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ConfigProvider, Mentions } from "antd";
import Image from "next/image";
import React, { ChangeEvent, useRef, useState } from "react";
import { addPostAction } from "@/app/lib/functions/user/post/addPost";
import Link from "next/link";
import Avatar_comp from "@/app/components/avatar_comp";
import useSearch from "@/app/lib/hooks/useSearch";
import { Profile } from "../home_main";
interface Props {
  avatar: string | null | undefined;
}

function Post_something({ avatar }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pending, setPending] = useState(false);

  const [query, setQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<
    { file: File; preview: string }[]
  >([]);
  const [content, setContent] = useState("");
  const [mentions, setMentions] = useState<{ username: string; id: string }[]>(
    []
  );
  function SubmitButton({
    selectedFiles,
  }: {
    selectedFiles: { file: File; preview: string }[];
  }) {
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setPending(true);
      const formData = new FormData();
      formData.append("content", content);
      selectedFiles.forEach((fileObj, index) => {
        formData.append(`file${index}`, fileObj.file);
      });

      try {
        await addPostAction(formData);
      } finally {
        setContent("");
        setSelectedFiles([]);
        setPending(false);
      }
    };

    return (
      <Button type="primary" loading={pending} onClick={handleSubmit}>
        Post
      </Button>
    );
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const newFiles = Array.from(files);

      newFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const preview = reader.result as string;
          setSelectedFiles((prevFiles) => [...prevFiles, { file, preview }]);
        };

        reader.readAsDataURL(file);
      });
    }
  };
  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const { loading, list } = useSearch<Profile>(
    "/api/friends/search",
    { empty: "" },
    query
  );
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
      <div className="flex flex-col w-full gap-1 p-2 mb-4 bg-white rounded-md">
        <h4 className="font-semibold select-none">Post Something</h4>
        <hr />
        <form action={addPostAction} className="flex flex-col items-end gap-2">
          <div className="flex w-full">
            <Link
              href={"/home/profile"}
              className="rounded-full size-[40px] overflow-hidden flex justify-center items-center"
            >
              <Avatar_comp
                src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${avatar}`}
                height={30}
                width={30}
                alt={"user avatar"}
              />
            </Link>
            <input
              onChange={handleFileChange}
              type={"file"}
              name={"assets"}
              className="hidden"
              ref={fileInputRef}
              multiple
            />

            <Mentions
              rows={5}
              name="content"
              disabled={pending}
              value={content}
              prefix={"@"}
              onSelect={(option) => {
                setMentions((prev) => [
                  ...prev,
                  {
                    username: option.value ?? "",
                    id: option.key?.split(",")[1] ?? "",
                  },
                ]);
              }}
              loading={loading}
              onSearch={(text) => {
                setQuery(text);
              }}
              onChange={(text) => {
                setContent(text);
              }}
              placeholder="What's in your mind"
              className="w-full p-1 resize-none focus-visible:outline-none"
              options={list.map((user) => {
                return {
                  key: "mentionSearch," + user.id,
                  value: user.username,
                  label: (
                    <div className="flex items-center gap-1">
                      <Avatar_comp
                        height={30}
                        width={30}
                        alt={user.username + " avatar"}
                        src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${user.avatar_url}`}
                      />
                      <h6>{user.username}</h6>
                    </div>
                  ),
                };
              })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              disabled={pending}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
              icon={<FontAwesomeIcon icon={faImage} className="text-primary" />}
            >
              Image/video
            </Button>
            <SubmitButton selectedFiles={selectedFiles} />
          </div>
        </form>

        {selectedFiles && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedFiles.map((fileObj, index) => (
              <div
                className="relative size-[100px] overflow-hidden bg-gray-50 flex justify-center items-center"
                key={index * 21 + 1000}
              >
                {fileObj.file.type.startsWith("image/") ? (
                  <Image
                    className="h-auto"
                    width={95}
                    height={95}
                    alt={fileObj.file.name}
                    src={fileObj.preview}
                  />
                ) : fileObj.file.type.startsWith("video/") ? (
                  <video className="h-auto" width={95} height={95} controls>
                    <source src={fileObj.preview} type={fileObj.file.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p>Unsupported file type</p>
                )}
                <button
                  disabled={pending}
                  className="absolute top-0 left-0 flex items-center justify-center bg-white rounded-br-lg text-dark size-5 opacity-80"
                  onClick={() => removeFile(index)}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}

export default Post_something;
