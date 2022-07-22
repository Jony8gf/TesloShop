import React from 'react'
import NextLink from 'next/link'
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layout'

const LoginPage = () => {
  return (
    <AuthLayout title={'Iniciar Sesión'}>
        <Box sx={{width:350, padding:'10px 20px'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Correo" variant='filled' fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Contraseña" type="password" variant='filled' fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <NextLink href="/" passHref>
                        <Button color="secondary" className='circular-btn' size='large' fullWidth>
                            Ingresar
                        </Button>
                    </NextLink>
                </Grid>
                <Grid item xs={12}>
                    <NextLink href="/auth/register" passHref>
                        <Button color="primary" className='circular-btn' size='large' fullWidth>
                            Registrarse
                        </Button>
                    </NextLink>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent='center'>
                    <NextLink href="/auth/forgetPassword" passHref>
                        <Link underline='always'>
                            ¿Te has olvidado de la contraseña?
                        </Link>
                    </NextLink>
                </Grid>
            </Grid>
        </Box>
    </AuthLayout>
  )
}

export default LoginPage