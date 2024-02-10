import { useState, useEffect } from "react";

function useFetchPage<T>(
  url: string,
  params: {
    [key: string]: string | number | boolean;
  },
  initialList: T[],
  from: number,
  to: number
) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<T[]>(initialList);
  const [hasMore, setHasMore] = useState(true);
  const [dom_loaded, setDom_loaded] = useState(false);
  useEffect(() => {
    if (dom_loaded) {
      setList([]);
      setLoading(true);
    }
  }, [params.orderKey]);
  useEffect(() => {
    setLoading(true);
    let controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${url}?from=${Number(from + (list.length === 0 ? 0 : 1))}&to=${to}&${Object.entries(
            params
          )
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
            setList((prev) => [...prev, ...data.data]);
            setHasMore(data.data.length > 0);
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoading(false);
          setHasMore(false);
        }
      }
    };
    if (dom_loaded) {
      fetchData();
    }
    setDom_loaded(true);
    return () => {
      controller.abort();
    };
  }, [from]);

  return { loading, list, setList, hasMore };
}

export default useFetchPage;
