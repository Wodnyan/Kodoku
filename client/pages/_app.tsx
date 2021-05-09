import "../styles/globals.css";
import Router from "next/router";
import Head from "next/head";
import { AuthProvider } from "../context/auth/AuthProvider";
import ProgressBar from "@badrap/bar-of-progress";
import { RecoilRoot } from "recoil";

const progress = new ProgressBar({
  size: 2,
  color: "#3b49df",
  className: "bar-of-progress",
  delay: 200,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Kodoku</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <RecoilRoot>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </RecoilRoot>
    </>
  );
}

export default MyApp;
