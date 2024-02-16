"use client";
import { updateCoverAction } from "@/app/lib/functions/user/profile/updateCover";
import { Database } from "@/utils/supabase/supabase";
//prettier-ignore
//@ts-ignore
import { useFormStatus,useFormState } from "react-dom";
import { Alert, Avatar, Button, Modal } from "antd";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { updateProfileAction } from "@/app/lib/functions/user/profile/updateProfile";
import Avatar_comp from "@/app/components/avatar_comp";
interface Props {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
}
function Personal_cover({ profile }: Props) {
  const [isProfilePhotoModalOpen, setisProfilePhotoModalOpen] = useState(false);
  const CoverFileInputRef = useRef<HTMLInputElement | null>(null);
  const ProfileFileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedCoverFile, setselectedCoverFile] = useState<File | null>(null);
  const [selectedProfileFile, setselectedProfileFile] = useState<File | null>(
    null
  );

  const [current_cover_url, setcurrent_cover_url] = useState(profile.cover_url);
  const [current_profile_url, setcurrent_profile_url] = useState(
    profile.avatar_url
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [CoverState, coverFormAction] = useFormState(updateCoverAction, {
    message: "",
    path: "",
  });
  const [profileState, profileFormAction] = useFormState(updateProfileAction, {
    message: "",
    path: "",
  });
  useEffect(() => {
    if (CoverState.path) {
      setcurrent_cover_url(CoverState.path);
      setis_cover_edit(false);
    }
  }, [CoverState]);
  useEffect(() => {
    if (profileState.path) {
      setcurrent_profile_url(profileState.path);
      setis_profile_edit(false);
    }
  }, [profileState]);
  const handleCoverFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setselectedCoverFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setis_cover_edit(true);
    } else {
      // Clear the state if no file is selected
      setselectedCoverFile(null);
      setCoverImagePreview(null);
    }
  };
  const handleProfileFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setselectedProfileFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setis_profile_edit(true);
    } else {
      // Clear the state if no file is selected
      setselectedProfileFile(null);
      setProfileImagePreview(null);
    }
  };
  function SubmitButton({
    className,
    is_cover,
  }: {
    className: string;
    is_cover: boolean;
  }) {
    const { pending } = useFormStatus();
    return (
      <Button
        className={className}
        loading={pending}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (is_cover && !is_cover_edit) {
            setis_cover_edit(true);
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
  const [is_hovered_over_profile, setis_hovered_over_profile] = useState(false);
  const [is_cover_edit, setis_cover_edit] = useState(false);
  const [is_profile_edit, setis_profile_edit] = useState(false);
  return (
    <>
      {CoverState?.message && (
        <Alert
          closable
          message="Error"
          description={CoverState?.message}
          type="error"
          className="fixed z-30 bottom-4 left-4"
          showIcon
        />
      )}
      <div
        className="col-span-12 bg-gray-200 h-[250px] relative mb-10 "
        onMouseEnter={() => {
          setis_hovered_over_cover(true);
        }}
        onMouseLeave={() => {
          setis_hovered_over_cover(false);
        }}
      >
        <div
          className={
            "absolute z-10 w-full h-full transition cursor-pointer " +
            (is_hovered_over_cover && is_cover_edit
              ? "gradient-div"
              : "non-gradient-div")
          }
        ></div>
        {is_cover_edit && coverImagePreview && (
          <Image
            style={{ objectFit: "cover" }}
            fill
            alt=""
            src={coverImagePreview}
          />
        )}
        {!is_cover_edit && current_cover_url && (
          <Image
            src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/covers/${current_cover_url}`}
            style={{ objectFit: "cover" }}
            className="cursor-pointer"
            fill
            alt=""
          />
        )}
        <form action={coverFormAction}>
          <input
            onChange={handleCoverFileChange}
            type={"file"}
            name={"coverFile"}
            className="hidden"
            ref={CoverFileInputRef}
          />
          {is_cover_edit && (
            <SubmitButton
              className={"absolute bottom-0 right-0 z-20 m-2"}
              is_cover
            />
          )}
        </form>
        <form action={profileFormAction}>
          <input
            onChange={handleProfileFileChange}
            type={"file"}
            name={"profileFile"}
            className="hidden"
            ref={ProfileFileInputRef}
          />
          {is_profile_edit && (
            <SubmitButton
              className={"absolute -bottom-11 right-0 z-20 m-2"}
              is_cover={false}
            />
          )}
        </form>
        {is_hovered_over_cover && (
          <Button
            className="absolute top-0 left-0 z-30 m-2"
            type="default"
            onClick={() => CoverFileInputRef.current?.click()}
          >
            {is_cover_edit || current_cover_url ? "Change Cover" : "Add Cover"}
          </Button>
        )}

        <div
          className="absolute z-20 flex flex-col items-center -translate-x-1/2 cursor-pointer -bottom-8 left-1/2"
          onMouseEnter={() => {
            setis_hovered_over_profile(true);
          }}
          onMouseLeave={() => {
            setis_hovered_over_profile(false);
          }}
        >
          <div className="size-[150px] relative">
            {is_hovered_over_profile && (
              <Button
                onClick={() => ProfileFileInputRef.current?.click()}
                className="absolute z-30"
                icon={<FontAwesomeIcon icon={faPen} className="text-xs" />}
                size="small"
              ></Button>
            )}
            {is_profile_edit && profileImagePreview && (
              <Avatar_comp
                className="border-2 border-white"
                size={"large"}
                height={150}
                width={150}
                alt={profile.username + " avatar"}
                src={profileImagePreview}
              />
            )}
            {!is_profile_edit && current_profile_url && (
              <>
                {profile.avatar_url && (
                  <Modal
                    centered
                    className="w-full md:w-[70dvw] relative"
                    open={isProfilePhotoModalOpen}
                    footer={null}
                    onCancel={() => setisProfilePhotoModalOpen(false)}
                    cancelButtonProps={{ color: "#ffffff" }}
                  >
                    <div className="w-full h-full">
                      <div className="flex items-center justify-center h-[90dvh] w-full">
                        <Image
                          src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`}
                          height={400}
                          className="h-auto"
                          alt={`user avatar`}
                          width={600}
                        />
                      </div>
                    </div>
                  </Modal>
                )}
                <div onClick={() => setisProfilePhotoModalOpen(true)}>
                  <Avatar_comp
                    className="transition border-2 border-white cursor-pointer hover:brightness-75"
                    size={"large"}
                    src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${current_profile_url}`}
                    height={150}
                    width={150}
                    alt={profile.username + " avatar"}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Personal_cover;
