import "@/styles/Globals.scss";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  //@ts-ignore
  const getLayout = Component.getLayout ?? ((page) => page)
  return <>
    {getLayout(
      <>
        <Toaster />
        <Component {...pageProps} />
      </>

    )}
  </>
}
