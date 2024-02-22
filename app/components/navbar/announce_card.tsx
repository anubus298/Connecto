"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { useState } from "react";

function Announce_card() {
  const [show, setShow] = useState(true);
  return show ? (
    <div className="flex items-center justify-center w-full col-span-12 gap-4 p-1 text-white bg-primary">
      <h6 className="text-sm text-center">
        This site is currently in Alpha, for feedbacks{" "}
        <a
          className="font-semibold"
          href="mailto:araristaf@gmail.com&subject=Feedback"
        >
          araristaf@gmail.com
        </a>
      </h6>
      <Button
        size="small"
        className="text-white"
        type="text"
        onClick={() => setShow(false)}
        icon={<FontAwesomeIcon icon={faXmark} />}
      ></Button>
    </div>
  ) : (
    <></>
  );
}

export default Announce_card;
