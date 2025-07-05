import "@/styles/Globals.scss";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import NextNProgress from 'nextjs-progressbar'
import { useEffect } from "react";
import Cookies from 'js-cookie'
import { useAuthStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter()

  //@ts-ignore
  const getLayout = Component.getLayout ?? ((page) => page)

  const setUser = useAuthStore((state) => state.setUser);

  const setLoading = useAuthStore((state) => state.setLoading);

  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    try {
      const cookie = Cookies.get('user_meta');

      if (!cookie) return;

      const user = JSON.parse(cookie);
      if (user && user.name) {
        setUser(user);
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to parse user_meta cookie', error);
    }
  }, []);

  return <>
    <NextNProgress color={router.pathname.startsWith('/admin') ? '#000' : '#fff'} height={4} />
    <Toaster />
    <main style={theme.vars}>
      {getLayout(<Component {...pageProps} />)}
    </main>
  </>
}
