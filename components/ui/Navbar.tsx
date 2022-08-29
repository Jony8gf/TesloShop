import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { CartContext, UIContext } from '../../context'

export const Navbar = () => {

    const {asPath, push} = useRouter();

    const {toggleSideMenu} = useContext(UIContext);

    const {numberOfItems} = useContext(CartContext);

    const [searchTerm, setSearchTerm] = useState('');

    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;
        push(`/search/${ searchTerm }`);
    }

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center' style={{ textDecoration: 'none' }}>
                        <Typography variant='h6'>Jony |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />

                <Box sx={{display: isSearchVisible ? 'none' : {xs: 'none', sm:'block'}}}>
                    <NextLink href="/category/men">
                        <Link style={{ textDecoration: 'none' }}>
                            <Button className={ asPath === '/category/men' ? 'checked-button' : 'inherit'}>Hombres:</Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/women">
                        <Link style={{ textDecoration: 'none' }}>
                            <Button className={ asPath === '/category/women' ? 'checked-button' : 'inherit'}>Mujeres:</Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/kid">
                        <Link style={{ textDecoration: 'none' }}>
                            <Button className={ asPath === '/category/kid' ? 'checked-button' : 'no-checked-button'}>Niños:</Button>
                        </Link>
                    </NextLink>
                </Box>
                

                <Box flex={1} />

                {/* //Pantallas Grandes */}     
                {
                    isSearchVisible
                      ? <Input
                            sx={{display: {xs: 'none', sm:'flex'}}}
                            autoFocus
                            value={ searchTerm }
                            onChange={ (e) => setSearchTerm( e.target.value ) }
                            onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={ () => setIsSearchVisible(false)}
                                    >
                                    <ClearOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />

                    : 
                    <IconButton 
                        onClick={ () => setIsSearchVisible(true)}
                        className="fadeIn"
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                    >
                        <SearchOutlined />
                    </IconButton>
                }
                

                {/* //Pantallas pequñas */}               
                <IconButton 
                    sx={{display: {xs: 'flex', sm: 'none'}}}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href="/cart" passHref>
                    <Link>
                        <IconButton >
                            <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color="secondary" >
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button onClick={toggleSideMenu}>
                    Menu
                </Button>

            </Toolbar>
        </AppBar>
    )
}

export default Navbar