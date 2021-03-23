import React, { useRef, useState } from "react";
import useCloseOnClick from "../../hooks/close-on-click";

interface SettingsProps {
  closeSettings: () => void;
}

interface AccordionItemProps {
  name: string;
}

export const Settings: React.FC<SettingsProps> = ({ closeSettings }) => {
  const ref = useCloseOnClick(closeSettings);
  return (
    <div
      ref={ref}
      className="absolute overflow-auto top-0 left-0 z-50 w-full h-full bg-black bg-opacity-75 text-white"
    >
      <button
        onClick={closeSettings}
        className="absolute text-white top-8 right-8"
      >
        <img src="/close.svg" width={36} />
      </button>
      <Accordion />
    </div>
  );
};

const Accordion = () => {
  return (
    <div className="mt-4 w-1/2 mx-auto">
      {new Array(5).fill("").map((_, i) => (
        <AccordionItem name={String(i)} key={i}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue
          vel arcu at mollis. Nulla ut erat vel neque laoreet rhoncus. Praesent
          ac ligula a quam tempus sodales. Donec non commodo lacus. Etiam congue
          leo urna, sed mollis eros efficitur nec. Donec et felis id quam
          viverra tristique ac non diam. Nulla venenatis justo ut orci laoreet,
          at tempor ligula dictum. Vestibulum quis efficitur risus. Donec sit
          amet risus quis tellus volutpat mollis ac non metus. Nulla auctor
          suscipit quam id sagittis. Phasellus quis congue felis, ut aliquam
          orci. Mauris vulputate, turpis in maximus accumsan, ante odio
          facilisis sapien, sed ultrices enim est ac ex. Nullam lorem lorem,
          cursus non auctor nec, porta ac ligula. Ut nec tortor tristique,
          efficitur turpis id, hendrerit odio. Donec egestas congue nisi quis
          porttitor. Morbi neque augue, placerat vel dignissim eget, bibendum in
          eros. Nunc dignissim bibendum quam mattis commodo. Donec efficitur
          interdum nisl in pretium. Curabitur lobortis tortor eget lacus
          porttitor, non maximus ligula mollis. Phasellus hendrerit velit nisl,
          sed elementum ante dignissim sit amet. Ut ut nulla eros. Sed viverra
          in enim ac bibendum. Nunc libero mi, pellentesque et velit vel,
          pulvinar faucibus nulla. Fusce erat lacus, bibendum eu magna ac,
          sollicitudin ullamcorper mauris. Cras efficitur condimentum metus.
          Duis ut quam ac enim bibendum tempus. Suspendisse et diam sit amet
          metus gravida facilisis. Aliquam ultrices, mi non pharetra bibendum,
          ipsum odio aliquet lectus, in ornare augue sem vel sem. Donec bibendum
          elit a felis eleifend rutrum. Vestibulum iaculis urna nisi, ut luctus
          felis cursus vitae. Nullam consectetur quis risus vel pulvinar. Donec
          massa metus, interdum in finibus cursus, finibus eget metus. Cras et
          pretium dui. Donec cursus vel ante vitae convallis. Mauris rhoncus
          dapibus ex sed imperdiet. In lacinia nibh felis, at tempor ante
          bibendum nec. Nam tempus elit eu quam pulvinar, nec maximus metus
          tincidunt. Curabitur vel lorem cursus, congue orci quis, luctus ipsum.
          Maecenas lobortis orci a felis ullamcorper vestibulum. Vestibulum in
          arcu sed quam dictum consectetur eu interdum lectus. Nulla eros arcu,
          vestibulum vel hendrerit quis, scelerisque nec nunc. Donec sed metus
          dictum, sollicitudin turpis ac, blandit enim. Orci varius natoque
          penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Nulla condimentum consectetur lacus ac lobortis. Phasellus facilisis
          turpis vitae magna feugiat, sed fermentum ex accumsan. Sed nisl ante,
          tincidunt in metus vel, blandit hendrerit ipsum. Mauris consectetur ut
          eros ac ullamcorper. Praesent volutpat vel sem ac bibendum. Phasellus
          venenatis arcu elementum enim ultricies rhoncus. Phasellus scelerisque
          velit id orci sodales, nec vestibulum ante tincidunt. Fusce sed
          imperdiet est, ut pretium lorem. Nunc non hendrerit augue, mollis
          varius augue. Aliquam gravida lectus dolor, sit amet consectetur justo
          convallis in. Aliquam erat volutpat. Ut ultrices nisi sed nulla
          sollicitudin, sit amet feugiat nisl convallis. Maecenas massa arcu,
          dignissim in magna vitae, posuere pretium nunc. Proin eget pretium
          dui, et mollis turpis. Mauris faucibus massa eget sapien consectetur
          varius. Sed sed turpis eu turpis pulvinar efficitur. Aliquam gravida
          pulvinar euismod. Aenean maximus quis arcu eget interdum. Suspendisse
          aliquet lorem id convallis lobortis. Proin egestas nisi at urna
          aliquet aliquet. Praesent varius blandit orci nec blandit. Sed semper
          risus non commodo elementum. Maecenas semper pulvinar bibendum.
        </AccordionItem>
      ))}
    </div>
  );
};

const AccordionItem: React.FC<AccordionItemProps> = ({ name, children }) => {
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
