import { useCallback } from "react";

export default function useAuthFetch() {
  const authFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.code === "token_not_valid") {
      localStorage.clear();
      window.location.reload();
    }

    return data;
  }, []);

  return { authFetch };
}