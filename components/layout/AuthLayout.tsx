import { Box } from '@mui/material'
import Head from 'next/head'
import React, { FC } from 'react'
import FooterPage from '../ui/Footer';


interface Props{
    children?: React.ReactNode | undefined;
    title: string;
}

export const AuthLayout:FC<Props> = ({children, title}) => {
  return (
    <>
        <Head>
            <title>{title}</title>
        </Head>

        <main>
            <Box display='flex' justifyContent='center' alignItems='center' height="calc(100vh - 200px)">
                {children}
            </Box>
        </main>

        <footer>
            <FooterPage />
        </footer>

    </>
  )
}
