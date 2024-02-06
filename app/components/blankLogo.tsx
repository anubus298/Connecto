"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

function BlankLogo() {
  const [dom_loaded, setdom_loaded] = useState(false);
  useEffect(() => {
    setdom_loaded(true);
  }, []);
  return !dom_loaded ? (
    <div className="fixed z-50 flex items-center justify-center w-screen h-screen bg-white">
      <Image
        height={90}
        className="spin"
        priority
        width={90}
        src="/svg/ofclogo.svg"
        alt="Connecto Logo"
      />
    </div>
  ) : (
    <></>
  );
}

export default BlankLogo;
