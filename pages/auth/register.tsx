import React, { useState } from 'react'
import NextLink from 'next/link'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layout'
import { useForm } from 'react-hook-form'
import { validations } from '../../utils'
import { tesloApi } from '../../api'
import { ErrorOutline } from '@mui/icons-material'

type FormData = {
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
}

const RegisterPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showErrorPassword, setShowErrorPassword] = useState(false);
    const [showErrorEmail, setShowErrorEmail] = useState(false);

    const onRegisterUser = async ({ name, email, password, repeatPassword }: FormData) => {


        console.log("Name: " + name);
        console.log("email: " + email);
        console.log("password: " + password);
        console.log("repeatPassword: " + repeatPassword);

        setShowErrorPassword(false);
        setShowErrorEmail(false);

        if(password !== repeatPassword){
            setShowErrorPassword(true);
        }else{
            try {
                const { data } = await tesloApi.post('/user/register', { email, password, name });
                const { token, user } = data;
                console.log({ token, user });
    
            } catch (error) {
                setShowErrorEmail(true)
                console.log("El registro requiere datos correctoss");
            }
        } 
    }

    return (
        <AuthLayout title={'Registro'}>
            <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} display='flex' justifyContent='center'>
                            <Typography variant='h1' component='h1'>Registro</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre"
                                variant='filled'
                                fullWidth
                                {
                                ...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                                })
                                }
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Correo"
                                variant='filled'
                                fullWidth
                                {
                                ...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail
                                })
                                }
                                error={!!errors.email}
                                helperText={errors.email?.message}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type="password"
                                variant='filled'
                                fullWidth
                                {
                                ...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                })
                                }
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Repetir Contraseña"
                                type="password"
                                variant='filled'
                                fullWidth
                                {
                                ...register('repeatPassword', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                })
                                }
                                error={!!errors.repeatPassword}
                                helperText={errors.repeatPassword?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Chip 
                                label="Las contraseñas no coinciden"
                                color='error'
                                icon={<ErrorOutline />}
                                sx={{display: showErrorPassword ? 'flex' : 'none'}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Chip 
                                label="El correo ya esta registrado en el sistema."
                                color='error'
                                icon={<ErrorOutline />}
                                sx={{display: showErrorEmail ? 'flex' : 'none'}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                                <Button type="submit" color="secondary" className='circular-btn' size='large' fullWidth>
                                    Registrarse
                                </Button>
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
            </form>
        </AuthLayout>
    )
}

export default RegisterPage
