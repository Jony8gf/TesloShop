import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material'
import Cookies from 'js-cookie'
import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { CartList, CartOrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layout'
import { CartContext } from '../../context'
import { countries } from '../../utils'


const SummaryPage = () => {

    const {numberOfItems, shippingAddress, createOrder} = useContext(CartContext)
    const router = useRouter();

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
      if(!Cookies.get('firstName')){
        router.push('/checkout/address')
      }
    }, [router])

    const onCreateOrder = async () => {
        setIsPosting(true);
        const {hasError, message} = await createOrder(); 

        if(hasError){
            setErrorMessage(message);
            setIsPosting(false);
            return
        }

        router.replace(`/orders/${message}`);
    }

    if(!shippingAddress){
        return <></>;
    }



  return (
    <ShopLayout title={"Resumen de compra"} pageDescription={"Resumen de la orden de compra"}>
        <Typography variant="h1" component='h1'>Resumen de compra</Typography>
    
        <Grid container>
            <Grid item xs={12} sm={7}>
                <CartList />
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className="summary-card">
                    <CardContent>
                        <Typography variant='h2'>Resumen ({numberOfItems} {numberOfItems > 1 ? ' Productos' : ' Producto'})</Typography>
                        <Divider sx={{my:1}}/>

                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/checkout/address' passHref >
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <Typography variant='subtitle1'>Dirección de entrega</Typography>

                        <Typography>{shippingAddress?.firstName}</Typography>
                        <Typography>{shippingAddress?.lastName}</Typography>
                        <Typography>{shippingAddress?.address} {shippingAddress?.address2}</Typography>
                        <Typography>{shippingAddress?.zip} - {shippingAddress?.city}</Typography>
                        <Typography>{countries.countries.find(c => c.code === shippingAddress?.country)?.name}</Typography>
                        {/* <Typography>{shippingAddress?.country}</Typography> */}
                        <Typography>{shippingAddress?.phone}</Typography>

                        <Divider sx={{my:1}}/>

                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/cart' passHref >
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        {/* Orden Summary */}
                        <CartOrderSummary />
                        
                        <Box sx={{mt:3}} display='flex' flexDirection='column'>
                            <Button 
                                color='secondary' 
                                className="circular-btn" 
                                fullWidth
                                onClick={onCreateOrder}
                                disabled={isPosting}
                            >Checkout</Button>

                            <Chip 
                                color='error'
                                label={errorMessage}
                                sx={{display: errorMessage ? 'flex' : 'none', marginTop: 2}}
                            />
                        
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    </ShopLayout>
  )
}

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

export default SummaryPage