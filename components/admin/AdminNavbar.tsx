import { ShoppingCartOutlined } from '@mui/icons-material'
import { AppBar, Badge, Box, Button, IconButton, Link, Toolbar, Typography } from '@mui/material'
import NextLink from 'next/link'
import React, { useContext } from 'react'
import { UIContext } from '../../context'

export const AdminNavbar = () => {

    const { toggleSideMenu } = useContext(UIContext);

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center' style={{ textDecoration: 'none' }}>
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />              

                <Button onClick={toggleSideMenu}>
                    Menu
                </Button>

            </Toolbar>
        </AppBar>
    )
}

export default AdminNavbar