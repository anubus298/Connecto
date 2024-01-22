"use client";

import Image from "next/image";

function Suspense_Primary_navbar() {
  return (
    <nav className="flex items-center justify-between h-20 col-span-12 px-8 py-3 bg-white border-b-2 select-none text-dark">
      <Image
        height={50}
        width={50}
        src="/svg/logo_only_yellow_dark_stroke.svg"
        alt="Connecto Logo"
      />
    </nav>
  );
}

export default Suspense_Primary_navbar;
