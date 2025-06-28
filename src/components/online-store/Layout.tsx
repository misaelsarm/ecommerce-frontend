import { UIContext } from "@/context/ui/UIContext"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext } from "react"
import Nav from "./Navbar"
import Image from "next/image"

interface Props {
  title: string,
  children: any,
  image?: string,
  type?: string,
  description?: string
  keywords?: string
}

export const Layout = ({
  title,
  children,
  image = '/300x300.png',
  type = 'website',
  keywords,
  description = 'En Globemily® nos dedicamos a la creación de eventos, arreglos de globos y  arreglos florales estilo bouquet. Utilizamos flores frescas elegidas especialmente para cada uno de nuestros clientes en cajas, bases, ramos y demás productos, siempre con los mejores acabados.'
}: Props) => {
  const { asPath } = useRouter()

  const { visible, setVisible, modalType, searchVisible, setSearchVisible } = useContext(UIContext)

  return (
    <>
      <Head>
        <link rel='apple-touch-icon' sizes='57x57' href='/apple-icon-57x57.png' />
        <link rel='apple-touch-icon' sizes='60x60' href='/apple-icon-60x60.png' />
        <link rel='apple-touch-icon' sizes='72x72' href='/apple-icon-72x72.png' />
        <link rel='apple-touch-icon' sizes='76x76' href='/apple-icon-76x76.png' />
        <link rel='apple-touch-icon' sizes='114x114' href='/apple-icon-114x114.png' />
        <link rel='apple-touch-icon' sizes='120x120' href='/apple-icon-120x120.png' />
        <link rel='apple-touch-icon' sizes='144x144' href='/apple-icon-144x144.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/apple-icon-152x152.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-icon-180x180.png' />
        <link rel='icon' type='image/png' sizes='192x192' href='/android-icon-192x192.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='96x96' href='/favicon-96x96.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='msapplication-TileColor' content='#ffffff' />
        <meta name='msapplication-TileImage' content='/ms-icon-144x144.png' />
        <meta name='theme-color' content='#ffffff' />
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
        <meta property='og:url' content={`https://globemily.com.mx${asPath}`} />
        <meta property='og:type' content={type} />
        <meta property='og:title' content={title} />
        <meta property='og:image' content={image} />
        <meta property='og:image:alt' content='Logo de Globemily.' />
        <meta property='og:description' content={description} />
        <meta property='og:site_name' content='Globemily' />
        <meta property='og:locale' content='es_MX' />
        <title>{`Globemily | ${title}`}</title>
      </Head>
      <Nav />
      <div className='main__content'>
        {
          children
        }
      </div>
      {/* <Footer />
      <Modal
        onClose={() => { setVisible(false) }}
        visible={visible}
        type={modalType}
      />
      {
        searchVisible &&
        <Search setSearchVisible={setSearchVisible} />
      } */}

      <div className='fabs'>
        <a href='https://wa.me/528182101580' target='_blank' rel='noreferrer' className="fab fab-wa">
          <Image
            alt='wa logo'
            src='/wa.svg'
            width={40}
            height={40}
            objectFit='contain'
          />
        </a>
      </div>
    </>
  )
}
