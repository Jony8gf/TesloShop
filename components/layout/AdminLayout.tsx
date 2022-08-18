import { Box, Typography } from '@mui/material';
import React, { FC } from 'react'
import { AdminNavbar } from '../admin';
import { Navbar, SideMenu } from '../ui';
import FooterPage from '../ui/Footer';

interface Props {
    children?: React.ReactNode | undefined;
    title: string;
    subtitle: string;
    icon?: JSX.Element;
}

export const AdminLayout:FC<Props>= ({children, title, subtitle, icon}) => {
  return (
    <>
        <nav>
            <AdminNavbar></AdminNavbar>
        </nav>
        
        <SideMenu />
        
        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            minHeight: '642px',
            padding: '0px 30px'
        }}>
            <Box display='flex' flexDirection='column'>
                <Typography variant='h1' component='h1'>{icon}{title}</Typography>
                <Typography variant='h2' sx={{mb: 1}}>{subtitle}</Typography>
            </Box>
            <Box>
                {children}
            </Box>
        </main>

        <footer className='footer'>
            <FooterPage />
        </footer>

    </>
  )
}

export default AdminLayout;