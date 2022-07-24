// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";
import "../styles/globals.css";
import "../styles/button.css";

function MyApp({ Component, pageProps }) {
  return (
    // 2. Use at the root of your app
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
