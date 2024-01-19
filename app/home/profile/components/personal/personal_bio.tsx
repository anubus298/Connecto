"use client";
import React, { ChangeEvent, useState } from "react";
import addBioAction from "@/app/lib/functions/user/profile/addBio";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
function Personal_bio({ bio }: { bio: string | null }) {
  const [is_edit_bio, setis_edit_bio] = useState(false);
  const [current_bio, setcurrent_bio] = useState(bio);
  const [is_hovered_over_bio, setis_hovered_over_bio] = useState(false);
  return (
    <div className="flex justify-center ">
      <div
        className="relative px-2 py-1 bg-white rounded-sm w-[280px]"
        onMouseOver={() => setis_hovered_over_bio(true)}
        onMouseLeave={() => setis_hovered_over_bio(false)}
      >
        {current_bio && !is_edit_bio && (
          <h6 className="text-center select-none">{current_bio}</h6>
        )}
        {current_bio && is_hovered_over_bio && !is_edit_bio && (
          <div
            className="absolute bottom-0 right-0 flex items-center justify-center text-xs bg-white cursor-pointer size-5 rounded-tl-md"
            onClick={() => {
              setis_edit_bio(true);
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </div>
        )}
        {(!current_bio || is_edit_bio) && (
          <form className="flex flex-col gap-2" action={addBioAction}>
            {is_edit_bio && (
              <input
                className="block p-2 text-sm text-center focus-visible:outline-none"
                name="bio"
                defaultValue={current_bio as string}
                type={"text"}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setcurrent_bio(e.target.value);
                }}
              />
            )}
            <Button
              block
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (!is_edit_bio) {
                  setis_edit_bio(true);
                } else {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                  setis_edit_bio(false);
                }
              }}
              type="default"
            >
              {is_edit_bio ? "save" : "Add a bio"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Personal_bio;
