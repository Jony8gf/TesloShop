import React, { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layout'
import { useForm } from 'react-hook-form'
import { validations } from '../../utils'
// import { tesloApi } from '../../api'
import { ErrorOutline } from '@mui/icons-material'
// import { AuthContext } from '../../context'
import { useRouter } from 'next/router'
import { getSession, signIn, getProviders } from 'next-auth/react'
import { GetServerSideProps } from 'next';

type FormData = {
    email: string,
    password: string
}

const LoginPage = () => {

    const router = useRouter();
    // const {loginUser} = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);


    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
      getProviders().then(prov => {
        setProviders(prov)
      })
    }, [])
    


    const onLoginUser = async ({email, password}: FormData) => {
        
        setShowError(false);


        //Sin NextAuth
        // const isValidLogin = await loginUser(email, password);

        // if(!isValidLogin){
        //     setShowError(true);
        //     return
        // }

        // // try{
        // //     const {data} = await tesloApi.post('/user/login', {email, password});
        // //     const {token, user} = data;
        // //     console.log({token, user});

        // // }catch(error){
        // //     console.log("Las credenciales no son correctas")
            
        // // }

        // //Todo: navegar pantalla el usuario estaba sino home
        // const destino = router.query.p?.toString() || '/'
        // router.replace(destino);


        await signIn('credentials', { email, password }); 
        
    }

    return (
        <AuthLayout title={'Iniciar Sesión'}>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1' sx={{ textAlign: 'center'}}>Iniciar Sesión</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                type='email'
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
                                        minLength: {value: 6, message: 'Mínimo 6 caracteres'}                         
                                    })
                                }
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Chip 
                                label="No se reconoce ese usuario / contraseña"
                                color='error'
                                icon={<ErrorOutline />}
                                sx={{display: showError ? 'flex' : 'none'}}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            {/* <NextLink href="/" passHref>
                                
                            </NextLink> */}
                            <Button type="submit" color="secondary" className='circular-btn' size='large' fullWidth>
                                    Ingresar
                                </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <NextLink 
                                href={ router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'} 
                                passHref
                            >
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
                        <Grid item xs={12} display='flex' flexDirection='column' justifyContent='center'>
                            <Divider/>
                            {
                                Object.values(providers).map( (provider: any) => {
                                    
                                    if(provider.id === 'credentials') return <div key={provider.id}></div>

                                    return(
                                        <Button
                                            key={provider.id}
                                            variant='outlined'
                                            fullWidth
                                            sx={{mb:1}}
                                            onClick= { () => signIn(provider.id)}
                                        >
                                            {provider.name}
                                        </Button>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    
    const session = await getSession({req});
    const { p = '/' } = query;

    if(session){
        return {
            redirect:{
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default LoginPage
