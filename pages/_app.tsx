import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { lightTheme } from '../themes'
import { CssBaseline } from '@mui/material'
import { SWRConfig } from 'swr'

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <SWRConfig value={{
      // refreshInterval: 3000,
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
     >
      <ThemeProvider theme={lightTheme} >
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </SWRConfig>
    
  ) 
}

export default MyApp
