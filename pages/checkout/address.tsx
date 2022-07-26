import React, { useContext, useEffect, useState } from 'react';
import { ShopLayout } from '../../components/layout';
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { countries } from '../../utils';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { CartContext } from '../../context';
import { getToken } from 'next-auth/jwt';
import { GetServerSideProps } from 'next';

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const getAddressFromCookies = (): FormData => {
    return {
        firstName: Cookies.get("firstName") || '',
        lastName: Cookies.get("lastName") || '',
        address: Cookies.get("address") || '',
        address2: Cookies.get("address2") || '',
        zip: Cookies.get("zip") || '',
        city: Cookies.get("city") || '',
        country: Cookies.get("country") || countries.countries[0].code,
        phone: Cookies.get("phone") || '',
    }
}


const AddressPage = () => {

    const router = useRouter();
    const { updateAddress } = useContext(CartContext)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            zip: '',
            city: '',
            country: '',
            phone: '',
        }
    });

    // useEffect(() => {
    //     reset(getAddressFromCookies());
    // }, [reset])

    const [defaultCountry, setDefaultCountry] = useState('');

    useEffect(() => {
        const addressFromCookies = getAddressFromCookies();
        reset(addressFromCookies);
        setDefaultCountry(addressFromCookies.country)
    }, [reset, getAddressFromCookies])


    const onSubmitAddress = (data: FormData) => {
        updateAddress(data);
        router.push('/checkout/summary');
    }

    // const [code, setCode] = useState(paisDefault);

    return (
        <ShopLayout title={'Dirección'} pageDescription={'Confirmar dirección del destino'}>
            <form onSubmit={handleSubmit(onSubmitAddress)}>
                <Typography variant='h1' component='h1' sx={{ mt: 2 }}>Dirección</Typography>
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Nombre'
                            variant='filled'
                            fullWidth
                            {
                            ...register('firstName', {
                                required: 'Este campo es requerido'
                            })
                            }
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Apellido'
                            variant='filled'
                            fullWidth
                            {
                            ...register('lastName', {
                                required: 'Este campo es requerido'
                            })
                            }
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección'
                            variant='filled'
                            fullWidth
                            {
                            ...register('address', {
                                required: 'Este campo es requerido'
                            })
                            }
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección 2 (Opcional)'
                            variant='filled'
                            fullWidth
                            {
                            ...register('address2')
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Codigo Postal'
                            variant='filled'
                            fullWidth
                            {
                            ...register('zip', {
                                required: 'Este campo es requerido'
                            })
                            }
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Ciudad'
                            variant='filled'
                            fullWidth
                            {
                            ...register('city', {
                                required: 'Este campo es requerido'
                            })
                            }
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* <FormControl fullWidth> */}
                        {/* <TextField

                                // select
                                variant='filled'
                                fullWidth
                                label="País"
                                // defaultValue={code}
                                {
                                    ...register('country', {
                                        required: 'Este campo es requerido'
                                    })
                                    }
                                    error={!!errors.country}
                                    helperText={errors.country?.message}
                                >
                                {
                                    countries.countries.map((country) => (
                                        <MenuItem value={country.code} key={country.code}>{country.name}</MenuItem>
                                    ))
                                }
                            </TextField> */}
                        {/* <TextField
                            select
                            label='Country'
                            fullWidth
                            key={Cookies.get('country') || countries.countries[0].code}
                            defaultValue={Cookies.get('country') || countries.countries[0].code}
                            variant='filled'
                            {
                            ...register('country', {
                                required: 'El pais es obligatorio',
                            })
                            }
                            error={!!errors.country}
                        // helperText={ errors.country?.message }
                        >
                            {
                                countries.countries.map(country => (
                                    <MenuItem
                                        key={country.code}
                                        value={country.code}
                                    >
                                        {country.name}
                                    </MenuItem>
                                ))
                            }
                        </TextField> */}
                        {/* </FormControl> */}
                        <FormControl fullWidth>
                            {
                                !!defaultCountry && (
                                    <TextField
                                        select
                                        variant="filled"
                                        fullWidth
                                        label="País"
                                        defaultValue={defaultCountry}
                                        {...register("country", {
                                            required: "El país es requerido",
                                        })}
                                        error={!!errors.country}
                                        helperText={errors.country?.message}
                                    >
                                        {countries.countries.map((country) => (
                                            <MenuItem key={country.code} value={country.code}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Teléfono'
                            variant='filled'
                            fullWidth
                            {
                            ...register('phone', {
                                required: 'Este campo es requerido'
                            })
                            }
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                    <Button
                        color='secondary'
                        className='circular-btn'
                        size='large'
                        type='submit'
                    >Revisar Pedido</Button>
                </Box>
            </form>


        </ShopLayout>
    )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {

//     const { token = '' } = req.cookies;
//     let userId = '';
//     let isValidToken = false;

//     try {
//         userId = await jwt.isValidToken(token);
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false
//             }
//         }
//     }

//     console.log(Cookies.get("country"));
//     console.log(countries.countries.find(x => x.code === Cookies.get("country"))?.code.toString());
//     const paisDefault = countries.countries.find(x => x.code === Cookies.get("country"))?.code.toString() ? countries.countries.find(x => x.code === Cookies.get("country")) : countries.countries[0].code;

//     return {
//         props: {
//             paisDefault
//         }
//     }
// }

export const getServerSideProps: GetServerSideProps = async ({req}) => {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if ( !session ) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}



export default AddressPage
