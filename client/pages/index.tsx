import { Button } from "../components/Button/Button";
import NextLink from "next/link";
import styles from "../styles/homepage/homepage.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.heroTextContainer}>
        <h1>Welcome to Kodoku</h1>
        <p>A chat app for the lonely</p>
      </div>
      <div className={styles.buttonsContainer}>
        <NextLink href="/auth/register">
          <a>
            <Button>Sign Up</Button>
          </a>
        </NextLink>
        <NextLink href="/auth/login">
          <a>
            <Button>Log in</Button>
          </a>
        </NextLink>
      </div>
    </div>
  );
}
