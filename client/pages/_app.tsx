import "../styles/globals.css";
import { AuthProvider } from "../context/auth/AuthProvider";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
