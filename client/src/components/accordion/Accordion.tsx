import { useState, useRef } from "react";

interface AccordionItemProps {
  name: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  name,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const accordionRef = useRef<HTMLDivElement | null>(null);

  const openAccordion = () => {
    if (accordionRef.current) {
      const node = accordionRef.current;
      const scrollHeight = node.scrollHeight;
      node.style.height = open ? `0px` : `${scrollHeight}px`;
      setOpen((prev) => !prev);
    }
  };

  return (
    <div className="bg-white text-black overflow-hidden">
      <div className="p-4 bg-red-500 cursor-pointer" onClick={openAccordion}>
        <h1 className="text-black text-2xl">{name}</h1>
      </div>
      <div
        ref={accordionRef}
        className="transform h-0 transition-all duration-300 ease-in-out"
      >
        {children}
      </div>
    </div>
  );
};
