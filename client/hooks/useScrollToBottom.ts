import { useRef } from "react";

export const useScrollToBottom = () => {
  const ref = useRef<HTMLDivElement>(null);

  function scrollToBottom(behavior: ScrollBehavior) {
    ref?.current.scrollIntoView({ behavior });
  }

  return {
    ref,
    scrollToBottom,
  };
};
