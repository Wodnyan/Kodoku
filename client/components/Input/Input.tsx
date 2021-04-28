import React, { InputHTMLAttributes } from "react";
import styles from "./input.module.css";

interface Props {
  full?: boolean;
}

export const Input: React.FC<
  Props &
    React.DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
> = ({ full = false, ...props }) => {
  return (
    <>
      <input
        {...props}
        className={`${styles.input} ${full && styles.inputFull}`}
      />
    </>
  );
};
