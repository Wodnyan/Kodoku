import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import styles from "./avatar.module.css";

interface Props {
  src?: string;
}

export const Avatar: React.FC<
  Props & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ src, children, ...props }) => {
  return (
    <div className={`${styles.container}`} {...props}>
      {src ? <img src={src} /> : children}
    </div>
  );
};
