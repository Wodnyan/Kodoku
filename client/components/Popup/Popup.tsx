import { DetailedHTMLProps, HTMLAttributes } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import styles from "./popup.module.css";

type ViewportSizes = "sm" | "md" | "lg";

type Props = {
  closeOnClickOutside?: boolean;
  closeFn: () => void;
  size?: ViewportSizes;
};

export const Popup: React.FC<
  Props & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ closeOnClickOutside = true, closeFn, size = "sm", children }) => {
  const { ref } = useClickOutside(
    closeOnClickOutside
      ? closeFn
      : () => {
          console.log("CLOSE THIS");
        }
  );

  return (
    <div ref={ref} className={`${styles.popup} ${styles[size]}`}>
      {children}
    </div>
  );
};
