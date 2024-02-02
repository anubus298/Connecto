"use client";

import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfigProvider, Modal } from "antd";
import Carousel, { CarouselRef } from "antd/es/carousel";
import Image from "next/image";
import { Dispatch, RefObject, SetStateAction } from "react";
import { Post } from "../home_main";

interface Props {
  isAssetsModalOpen: boolean;
  post: Post;
  setIsAssetsModalOpen: Dispatch<SetStateAction<boolean>>;
  CarouselRef: RefObject<CarouselRef>;
  assets_count: number;
}
function Asset_modal({
  isAssetsModalOpen,
  setIsAssetsModalOpen,
  CarouselRef,
  post,
  assets_count,
}: Props) {
  const baseUrl: string | undefined = post?.media_url?.slice(
    0,
    post.media_url.lastIndexOf("/") + 1
  );
  return (
    <ConfigProvider
      theme={{
        token: {
          padding: 5,
          colorIcon: "#ffffff",
          colorIconHover: "#ffffff",
        },
        components: {
          Modal: { colorBgMask: "#000000", contentBg: "#000000" },
        },
      }}
    >
      <Modal
        centered
        className="w-full md:w-[70dvw] relative"
        open={isAssetsModalOpen}
        footer={null}
        onCancel={() => setIsAssetsModalOpen(false)}
        cancelButtonProps={{ color: "#ffffff" }}
      >
        <div className="w-full h-full">
          <Carousel
            infinite={false}
            className="w-full h-full"
            ref={CarouselRef}
            dots={false}
          >
            {post?.media_url
              ?.slice(
                post.media_url.lastIndexOf("/") + 1,
                post.media_url.length
              )
              .split(",")
              .map((img_src, index) => {
                return (
                  <div
                    className="flex items-center justify-center h-[90dvh] w-full"
                    key={img_src + 6000 + index * 20}
                  >
                    <Image
                      src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/${baseUrl}${img_src}`}
                      key={img_src + index}
                      height={400}
                      className="h-auto"
                      alt={`post asset number ${index + 1}`}
                      width={600}
                    />
                  </div>
                );
              })}
          </Carousel>
          {assets_count > 1 && (
            <>
              <button
                className="absolute bottom-0 right-0 flex items-center justify-center p-1 m-2 text-white rounded-md bg-primary size-6"
                onClick={() => CarouselRef.current?.next()}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
              <button
                className="absolute bottom-0 left-0 flex items-center justify-center p-1 m-2 text-white rounded-md bg-primary size-6"
                onClick={() => CarouselRef.current?.prev()}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            </>
          )}
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default Asset_modal;
