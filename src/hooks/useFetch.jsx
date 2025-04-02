import { useState, useEffect } from "react";

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => (isMounted = false);
  }, [url]);

  return { data, error, loading };
}
