"use client";

import Suspense_post from "./suspense_post";
function Suspense_posts() {
  return (
    <div className="flex flex-col gap-2">
      <Suspense_post />
      <Suspense_post />
      <Suspense_post />
    </div>
  );
}

export default Suspense_posts;
