import { useRef, useEffect } from "react";

export default function useCloseOnClick(close: () => void) {
  const ref = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    const handle = (e: any) => {
      if (ref.current && e.target === ref.current) {
        close();
      }
    };
    document.addEventListener("click", handle);
    return () => {
      document.removeEventListener("click", handle);
    };
  }, [close]);

  return ref;
}
