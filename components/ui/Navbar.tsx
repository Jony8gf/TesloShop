import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import { AppBar, Badge, Box, Button, IconButton, Link, Toolbar, Typography } from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export const Navbar = () => {

    const {asPath} = useRouter();

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />

                <Box sx={{display: {xs: 'none', sm:'block'}}}>
                    <NextLink href="/category/men">
                        <Link>
                            <Button className={ asPath === '/category/men' ? 'checked-button' : 'inherit'}>Hombres:</Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/women">
                        <Link>
                            <Button className={ asPath === '/category/women' ? 'checked-button' : 'inherit'}>Mujeres:</Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/kid">
                        <Link>
                            <Button className={ asPath === '/category/kid' ? 'checked-button' : 'no-checked-button'}>Niños:</Button>
                        </Link>
                    </NextLink>
                </Box>
                

                <Box flex={1} />

                <IconButton >
                    <SearchOutlined />
                </IconButton>

                <NextLink href="/cart" passHref>
                    <Link>
                        <IconButton >
                            <Badge badgeContent={2} color="secondary" >
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button>
                    Menu
                </Button>

            </Toolbar>
        </AppBar>
    )
}

export default Navbar