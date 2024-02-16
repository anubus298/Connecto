"use client";
import { useState, useEffect } from "react";
function useSearch<T>(
  url: string,
  params: {
    [key: string]: string | number | boolean;
  },
  query: string
) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<T[]>([]);
  useEffect(() => {
    if (query.length === 0) {
      setList([]);
      setLoading(false);
    }
  }, [query]);
  useEffect(() => {
    setLoading(true);
    let controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${url}?query=${query}&${Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&")}`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );
        if (!controller.signal.aborted) {
          const data = await response.json();
          if (data.error) {
          } else {
            setLoading(false);
            setList(data.data);
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    query.length !== 0 && fetchData();
    return () => {
      controller.abort();
    };
  }, [query]);

  return { loading, list };
}

export default useSearch;
