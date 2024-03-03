"use client";

import { Input } from "antd";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
const { Search } = Input;
interface Props {
  init?: string;
  className?: string;
}
function Search_bar({ init, className }: Props) {
  const [query, setQuery] = useState<string>(init ?? "");
  const router = useRouter();
  return (
    <Search
      className={className}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
      value={query}
      placeholder="Search"
      style={{ width: 200 }}
      onSearch={() => router.push("/home/search?query=" + query)}
    />
  );
}

export default Search_bar;
