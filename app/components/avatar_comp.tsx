"use client";

import { Avatar, ConfigProvider } from "antd";
import Image from "next/image";
interface Props {
  src: string;
  height: number;
  width: number;
  alt: string;
  size?: "small" | "default" | "large";
  className?: string;
}
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;
const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
function Avatar_comp({
  src,
  height,
  width,
  alt,
  size = "default",
  className,
}: Props) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Avatar: {
            containerSize: height,
            containerSizeSM: height,
            containerSizeLG: height,
          },
        },
      }}
    >
      <Avatar
        className={className}
        size={size}
        shape="square"
        src={
          <Image
            placeholder={
              height < 40 && width < 40
                ? undefined
                : `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`
            }
            src={
              src.slice(src.lastIndexOf("/") + 1) !== "null"
                ? src
                : "https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/server/ano.jpg"
            }
            height={height}
            width={width}
            alt={alt}
          />
        }
      />
    </ConfigProvider>
  );
}

export default Avatar_comp;
