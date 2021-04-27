import React from "react";
import { Spinner } from "../Spinner/Spinner";
import styles from "./button.module.css";

interface Props {
  children: React.ReactNode;
  full?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<
  Props &
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
> = ({ block = false, isLoading = false, children, ...props }) => {
  return (
    <button {...props} className={`${styles.btn} ${block && styles.btnFull}`}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
};
