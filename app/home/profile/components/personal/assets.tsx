"use client";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { MediaUrl } from "./personal_profile";
import { useRef } from "react";
interface Props {
  mediaUrl: MediaUrl[] | null;
}
function Assets({ mediaUrl }: Props) {
  let totalImagesDisplayed = 0;
  const AssetsRef = useRef<HTMLDivElement>(null);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return !isTabletOrMobile ? (
    <div className="col-span-4" ref={AssetsRef}>
      <div
        className="sticky top-0 p-3 rounded-md bg-secondary h-fit"
        style={{ width: AssetsRef.current?.offsetWidth }}
      >
        <div className="flex items-center justify-between">
          <h3 className=" h3">Images</h3>
        </div>
        <div className="w-full h-[1px] bg-yellow-200 mb-6 mt-[1px]"></div>
        <div className="grid grid-cols-3 grid-rows-3 gap-1">
          {mediaUrl &&
            mediaUrl.map((media) => {
              return media.medias.map((asset, innerIndex) => {
                if (totalImagesDisplayed < 9) {
                  totalImagesDisplayed++;
                  return (
                    <Link
                      href={"/home/post?id=" + media.id}
                      className="relative col-span-1 h-[120px] hover:brightness-75 transition rounded-md overflow-hidden"
                      key={`mediaofpost${media.id}number${innerIndex}`}
                    >
                      <Image
                        src={
                          "https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/" +
                          media.baseUrl +
                          asset
                        }
                        fill
                        style={{ objectFit: "cover" }}
                        alt={`media of post ${media.id} number ${innerIndex}`}
                      />
                    </Link>
                  );
                }
              });
            })}
          {mediaUrl?.length === 0 && (
            <div className="flex items-center justify-center w-full col-span-3 p-10">
              <p className="text-sm text-yellow-500">Empty</p>
            </div>
          )}
        </div>
        <div className="flex justify-end mx-2 mt-4">
          <Link href={"/home/profile/assets"} type="text">
            View All
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <p></p>
  );
}

export default Assets;
