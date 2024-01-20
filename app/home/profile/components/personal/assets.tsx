"use client";

import { useMediaQuery } from "react-responsive";

function Assets() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return !isTabletOrMobile ? (
    <div className="col-span-4 bg-secondary">khaltk</div>
  ) : (
    <p></p>
  );
}

export default Assets;
