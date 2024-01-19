import { faImage, faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button } from "antd";
// prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
interface Props {
  avatar: string | null | undefined;
  postAction: any;
}

function Post_something({ avatar, postAction }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[] | null>(null);
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
        className="h-full text-white rounded-sm bg-primary"
      >
        Post
      </Button>
    );
  }
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      // @ts-ignore
      setSelectedFiles((prevFiles) => {
        const updatedFiles = prevFiles
          ? [...Array.from(prevFiles), ...Array.from(files)]
          : Array.from(files);
        return updatedFiles;
      });

      const previews: string[] = [];
      const totalFiles = (selectedFiles?.length || 0) + files.length;

      for (let i = 0; i < totalFiles; i++) {
        const reader = new FileReader();
        const currentFile =
          i < (selectedFiles?.length || 0)
            ? selectedFiles![i]
            : files[i - (selectedFiles?.length || 0)];

        if (currentFile) {
          reader.onloadend = (e) => {
            if (e.target && e.target.result) {
              previews.push(e.target.result as string);

              if (previews.length === totalFiles) {
                setImagePreviews(previews);
              }
            }
          };

          // Read the file after updating the state
          reader.readAsDataURL(currentFile);
        }
      }
    } else {
      return;
    }
  };

  const handleDeleteImage = (index: number) => {
    if (imagePreviews && selectedFiles) {
      const updatedPreviews = [...imagePreviews];
      updatedPreviews.splice(index, 1);
      setImagePreviews(updatedPreviews);

      const updatedFiles = Array.from(selectedFiles);
      updatedFiles.splice(index, 1);

      // Create a new FileList using a workaround
      const newFileList = {
        length: updatedFiles.length,
        item: (i: number) => updatedFiles[i],
      } as FileList;

      setSelectedFiles(newFileList);
    }
  };

  return (
    <div className="flex flex-col w-full gap-1 p-2 my-1 mb-6 bg-white">
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
            multiple // Allow multiple file selections
          />
          <input
            name="content"
            type={"text"}
            placeholder="What's in your mind"
            className="w-full p-1 focus-visible:outline-none"
          />
          <button>
            <FontAwesomeIcon
              onClick={() => fileInputRef.current?.click()}
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
          {imagePreviews.map((preview, index) => (
            <div
              className="relative size-[100px] overflow-hidden bg-gray-50 flex justify-center items-center"
              key={index * 12 + 4562}
            >
              <Image
                className="h-auto"
                width={95}
                height={95}
                alt=""
                src={preview}
              />
              <button
                className="absolute top-0 left-0 text-red-500"
                onClick={() => handleDeleteImage(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Post_something;
