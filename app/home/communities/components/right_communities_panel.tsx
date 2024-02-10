"use client";
import Link from "next/link";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Right_communities_panel() {
  return (
    <div className="col-span-2">
      <Link href={"/home/communities/create"}>
        <Button
          block
          size="large"
          className="mt-4"
          type="primary"
          icon={<FontAwesomeIcon icon={faPlus} />}
        >
          Create new
        </Button>
      </Link>
    </div>
  );
}

export default Right_communities_panel;
