import "@/styles/Globals.scss";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import NextNProgress from 'nextjs-progressbar'
import { useEffect } from "react";
import Cookies from 'js-cookie'
import { makeRequest } from "@/utils/makeRequest";
import { useAuthStore } from "@/store/auth";

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter()

  //@ts-ignore
  const getLayout = Component.getLayout ?? ((page) => page)

  const setUser = useAuthStore((state) => state.setUser);

  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    console.log('running')
    async function fetchData() {
      const token = Cookies.get('token')
      if (!token) return
      try {
        const data = await makeRequest('get', '/api/auth/renew');
        setUser(data)
        setLoading(false)
      } catch (error: any) {
        setLoading(false)
        //toast.error(error.response?.data?.message || error.message)
      }
    }
    fetchData();
  }, []); // Or [] if effect doesn't need props or state

  return <>
    <NextNProgress color={router.pathname.startsWith('/admin') ? '#000' : '#fff'} height={4} />
    <Toaster />
    {/* <AuthProvider>
      <UIProvider> */}
    {getLayout(<Component {...pageProps} />)}
    {/* </UIProvider>
    </AuthProvider> */}
  </>
}
