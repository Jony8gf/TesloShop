import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { lightTheme } from '../themes'
import { CssBaseline } from '@mui/material'
import { SWRConfig } from 'swr'
import { AuthProvider, CartProvider, UiProvider } from '../context'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{
      // refreshInterval: 3000,
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
    }}
    >
      <AuthProvider>

        <CartProvider>

          <UiProvider>

            <ThemeProvider theme={lightTheme} >
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
            
          </UiProvider>

        </CartProvider>

      </AuthProvider>

    </SWRConfig>

  )
}

export default MyApp
