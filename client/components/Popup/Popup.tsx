import { DetailedHTMLProps, HTMLAttributes } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import styles from "./popup.module.css";

type Props = {
  closeOnClickOutside: boolean;
  closeFn: () => void;
};

export const Popup: React.FC<
  Props & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ closeOnClickOutside = true, closeFn, children }) => {
  const { ref } = useClickOutside(
    closeOnClickOutside
      ? closeFn
      : () => {
          console.log("CLOSE THIS");
        }
  );

  return (
    <div ref={ref} className={styles.popup}>
      {children}
    </div>
  );
};
