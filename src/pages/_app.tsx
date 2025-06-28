import { AuthProvider } from "@/context/auth/AuthProvider";
import "@/styles/Globals.scss";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import NextNProgress from 'nextjs-progressbar'
import { UIProvider } from "@/context/ui/UIProvider";

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter()

  //@ts-ignore
  const getLayout = Component.getLayout ?? ((page) => page)

  return <>
    <NextNProgress color={router.pathname.startsWith('/admin') ? '#000' : '#fff'} height={4} />
    <Toaster />
    <AuthProvider>
      <UIProvider>
        {getLayout(<Component {...pageProps} />)}
      </UIProvider>
    </AuthProvider>
  </>
}
