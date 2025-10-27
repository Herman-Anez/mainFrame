

import type { AppProps } from "next/app";
import AuthWrapper from "./AuthWrapper";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthWrapper>
      <Component {...pageProps} />
    </AuthWrapper>
  );
}