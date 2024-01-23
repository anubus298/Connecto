"use client";
import { updateCoverAction } from "@/app/lib/functions/user/profile/updateCover";
import { Database } from "@/utils/supabase/supabase";
//prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";
import { Avatar, Button } from "antd";
import Image from "next/image";
import React, { ChangeEvent, useRef, useState } from "react";
interface Props {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
}
function Personal_cover({ profile }: Props) {
  const fileInputRed = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setselectedFile] = useState<File | null>(null);
  const [current_cover_url, setcurrent_cover_url] = useState(profile.cover_url);
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
      setis_edit(true);
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
        className="absolute bottom-0 right-0 z-20 m-2"
        loading={pending}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (!is_edit) {
            setis_edit(true);
          } else {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
        type="primary"
      >
        Save
      </Button>
    );
  }
  const [is_hovered_over_cover, setis_hovered_over_cover] = useState(false);
  const [is_edit, setis_edit] = useState(false);
  return (
    <div
      className="col-span-12 bg-gray-200 h-[250px] relative mb-10 "
      onMouseOver={() => {
        setis_hovered_over_cover(true);
      }}
      onMouseLeave={() => {
        setis_hovered_over_cover(false);
      }}
    >
      <div
        className={
          "absolute z-10 w-full h-full transition " +
          (is_hovered_over_cover && is_edit
            ? "gradient-div"
            : "non-gradient-div")
        }
      ></div>
      {is_edit && imagePreview && (
        <Image style={{ objectFit: "cover" }} fill alt="" src={imagePreview} />
      )}
      {!is_edit && current_cover_url && (
        <Image
          src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/covers/${current_cover_url}`}
          style={{ objectFit: "cover" }}
          className="cursor-pointer"
          fill
          alt=""
        />
      )}
      <form className="" action={updateCoverAction}>
        <input
          onChange={handleFileChange}
          type={"file"}
          name={"coverFile"}
          className="hidden"
          ref={fileInputRed}
        />
        {is_edit && <SubmitButton />}
      </form>
      {is_hovered_over_cover && (
        <Button
          className="z-20 m-2"
          type="default"
          onClick={() => fileInputRed.current?.click()}
        >
          {is_edit || current_cover_url ? "Change Cover" : "Add Cover"}
        </Button>
      )}

      <div className="absolute z-20 flex flex-col items-center -translate-x-1/2 -bottom-8 left-1/2">
        <Avatar
          className="border-2 border-white"
          shape="square"
          size={"large"}
          src={
            <Image
              src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`}
              height={150}
              width={150}
              alt={profile.username + " avatar"}
            />
          }
        />
      </div>
    </div>
  );
}

export default Personal_cover;
