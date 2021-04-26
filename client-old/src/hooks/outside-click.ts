import { useRef, useEffect } from "react";

export default function useOutsideClick(onClick: () => void) {
  const ref = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    const handle = (e: any) => {
      if (ref.current && e.target !== ref.current) {
        onClick();
      }
    };
    document.addEventListener("click", handle);
    return () => {
      document.removeEventListener("click", handle);
    };
  }, [onClick]);

  return ref;
}
