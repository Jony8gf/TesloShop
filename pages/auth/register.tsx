import React from 'react'
import NextLink from 'next/link'
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layout'

const RegisterPage = () => {
  return (
    <AuthLayout title={'Registro'}>
        <Box sx={{width:350, padding:'10px 20px'}}>
            <Grid container spacing={2}>
                <Grid item xs={12} display='flex' justifyContent='center'>
                    <Typography variant='h1' component='h1'>Registro</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Nombre" variant='filled' fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Correo" variant='filled' fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Contraseña" type="password" variant='filled' fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Repetir Contraseña" type="password" variant='filled' fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <NextLink href="/" passHref>
                        <Button color="secondary" className='circular-btn' size='large' fullWidth>
                            Registrarse
                        </Button>
                    </NextLink>
                </Grid>
                <Grid item xs={12}>
                    <NextLink href="/auth/login" passHref>
                        <Button color="error" className='circular-btn' size='large' fullWidth>
                            Cancelar
                        </Button>
                    </NextLink>
                </Grid>
            </Grid>
        </Box>
    </AuthLayout>
  )
}

export default RegisterPage
