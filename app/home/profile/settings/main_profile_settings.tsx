"use client";

import { updateAddressAction } from "@/app/lib/functions/user/profile/updateAddress";
import { updateBirthdayAction } from "@/app/lib/functions/user/profile/updateBirthday";
import { updateFullNameAction } from "@/app/lib/functions/user/profile/updatefullName";
import { updatePhoneNumberAction } from "@/app/lib/functions/user/profile/updatePhoneNumber";
import { Tables } from "@/utils/supabase/supabase";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button, ConfigProvider, Modal } from "antd";
import Image from "next/image";
import { MouseEvent, useState } from "react";

interface Props {
  my_profile: {
    avatar_url: string | null;
    username: string | null;
  } | null;
  personal_info: Tables<"personal_info"> | null;
}
function Main_profile_settings({ my_profile, personal_info }: Props) {
  const [isProfilePhotoModalOpen, setisProfilePhotoModalOpen] = useState(false);
  const [fullName_edit, setFullName_edit] = useState(false);
  const [address_edit, setAddress_edit] = useState(false);
  const [birthday_edit, setBirthday_edit] = useState(false);
  const [phoneNumber_edit, setPhoneNumber_edit] = useState(false);
  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: { colorBgMask: "#000000", contentBg: "#000000" },

          Avatar: { containerSizeLG: 120 },
        },
      }}
    >
      <div className="grid h-full grid-cols-12 ">
        <div className="grid grid-cols-12 col-start-3 col-end-11 gap-12 p-3 bg-white rounded-md">
          <div className="col-span-12">
            <h1 className="h1">My profile</h1>
            <h6 className="text-gray-500">configure your profile settings</h6>
          </div>
          <div className="col-span-6 ms-4">
            <h3 className="mb-4 text-3xl font-semibold">your profile photo</h3>
            <div className="flex gap-8">
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
                      src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${my_profile?.avatar_url}`}
                      height={400}
                      className="h-auto"
                      alt={`user avatar`}
                      width={600}
                    />
                  </div>
                </div>
              </Modal>
              <button onClick={() => setisProfilePhotoModalOpen(true)}>
                <Avatar
                  size={"large"}
                  shape="square"
                  src={
                    <Image
                      src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${my_profile?.avatar_url}`}
                      height={120}
                      width={120}
                      alt={"user avatar"}
                    />
                  }
                />
              </button>
              <div className="flex flex-col justify-evenly">
                <Button block type="primary">
                  Change Profile
                </Button>
                <Button block danger icon={<FontAwesomeIcon icon={faTrash} />}>
                  Delete
                </Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              The recommended size is 256x256 pixels.
            </p>
          </div>
          <div className="relative col-span-6 p-3 rounded-md bg-gray-50 h-[180px] me-4 select-none">
            <div className="grid grid-cols-2 ">
              <div className="col-span-1">
                <h6 className="text-lg font-semibold">build confidence</h6>
                <p className="text-sm text-gray-700">
                  Your profile photo will be displayed in email search results,
                  providing a visual representation associated with the
                  identified email address.
                </p>
              </div>
              <div className="absolute right-0 col-span-1 -top-10">
                <Image
                  className=""
                  src={"/svg/ecology-2-6.svg"}
                  height={200}
                  width={200}
                  alt="illustration"
                />
              </div>
            </div>
          </div>
          <div className="col-span-12 mx-4 ">
            <div className="mb-3">
              <h6 className="font-semibold text-gray-500">Full name</h6>
              <form
                className="flex items-center gap-2"
                action={updateFullNameAction}
              >
                <input
                  name="fullName"
                  className="px-2 py-1 border-2 border-gray-200 placeholder:text-gray-700"
                  disabled={!fullName_edit}
                  required
                  placeholder={personal_info?.full_name ?? ""}
                />
                <Button
                  type={fullName_edit ? "primary" : "default"}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    if (!fullName_edit) {
                      setFullName_edit(true);
                    } else {
                      try {
                        e.currentTarget.form?.requestSubmit();
                        setFullName_edit(false);
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }}
                >
                  {fullName_edit ? "Save" : "Edit"}
                </Button>
              </form>
            </div>
            <div className="mb-3">
              <h6 className="font-semibold text-gray-500">Address</h6>
              <form
                className="flex items-center gap-2"
                action={updateAddressAction}
              >
                <address>
                  <input
                    name="address"
                    className="px-2 py-1 border-2 border-gray-200 placeholder:text-gray-700"
                    disabled={!address_edit}
                    placeholder={personal_info?.address ?? ""}
                  />
                </address>
                <Button
                  type={address_edit ? "primary" : "default"}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    if (!address_edit) {
                      setAddress_edit(true);
                    } else {
                      try {
                        e.currentTarget.form?.requestSubmit();
                        setAddress_edit(false);
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }}
                >
                  {address_edit ? "Save" : "Edit"}
                </Button>
              </form>
            </div>
            <div className="mb-3">
              <h6 className="font-semibold text-gray-500">Birthday</h6>
              <form
                className="flex items-center gap-2"
                action={updateBirthdayAction}
              >
                <input
                  type={birthday_edit ? "date" : "text"}
                  name="birthday"
                  className="px-2 py-1 border-2 border-gray-200 placeholder:text-gray-700"
                  disabled={!birthday_edit}
                  placeholder={personal_info?.birthday ?? ""}
                />
                <Button
                  type={birthday_edit ? "primary" : "default"}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    if (!birthday_edit) {
                      setBirthday_edit(true);
                    } else {
                      try {
                        e.currentTarget.form?.requestSubmit();
                        setBirthday_edit(false);
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }}
                >
                  {birthday_edit ? "Save" : "Edit"}
                </Button>
              </form>
            </div>
            <div className="mb-3">
              <h6 className="font-semibold text-gray-500">Phone number</h6>
              <form
                className="flex items-center gap-2"
                action={updatePhoneNumberAction}
              >
                <input
                  name="phoneNumber"
                  className="px-2 py-1 border-2 border-gray-200 placeholder:text-gray-700"
                  disabled={!phoneNumber_edit}
                  placeholder={personal_info?.phone_number ?? ""}
                />
                <Button
                  type={phoneNumber_edit ? "primary" : "default"}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    if (!phoneNumber_edit) {
                      setPhoneNumber_edit(true);
                    } else {
                      try {
                        e.currentTarget.form?.requestSubmit();
                        setPhoneNumber_edit(false);
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }}
                >
                  {phoneNumber_edit ? "Save" : "Edit"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Main_profile_settings;
