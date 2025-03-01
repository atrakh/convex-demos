import "../styles/globals.css";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import {
  ConvexReactClient,
  Authenticated,
  AuthLoading,
  Unauthenticated,
} from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function MyApp({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri:
          typeof window === "undefined" ? undefined : window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        <Authenticated>
          <Component {...pageProps} />
        </Authenticated>
        <Unauthenticated>
          <Login />
        </Unauthenticated>
        <AuthLoading>
          <Loading />
        </AuthLoading>
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  );
}

function Loading() {
  return (
    <div className={styles.loadingLayout}>
      <div className={styles.loading} />
    </div>
  );
}

function Login() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className={styles.container}>
      <Head>
        <title>Next.js with Convex</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js</a> with{" "}
          <a href="https://convex.dev">Convex</a>
        </h1>

        <button className={styles.button} onClick={loginWithRedirect}>
          Log in
        </button>
      </main>
    </div>
  );
}
