import styles from "./error-message.module.css";

type Props = {
  error: string;
};

export const ErrorMessage: React.FC<Props> = ({ error }) => {
  return <p className={styles.error}>{error}</p>;
};
