import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material'
import NextLink from 'next/link'
import React from 'react'
import { CartList, CartOrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layout'

const OrderPage = () => {
    return (
        <ShopLayout title={"Resumen de la orden 43141234134"} pageDescription={"Resumen de la orden de compra"}>
            <Typography variant="h1" component='h1'>Orden: 43141234134</Typography>

            {/* <Chip
                sx={{ my: 2 }}
                label="Pendiente de pago"
                variant='outlined'
                color='error'
                icon={<CreditCardOffOutlined />}
            /> */}

            <Chip
                sx={{ my: 2 }}
                label="Pagada"
                variant='outlined'
                color='success'
                icon={<CreditScoreOutlined />}
            />
            
            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant='h2'>Resumen (3 productis)</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/checkout/address' passHref >
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            <Typography>Jonathan Gonzalez</Typography>
                            <Typography>332 Calle mayor</Typography>
                            <Typography>catro Urdiales, 39700</Typography>
                            <Typography>España</Typography>
                            <Typography>+34 666 666 666</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref >
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            {/* Orden Summary */}
                            <CartOrderSummary />

                            <Box sx={{ mt: 3 }}>
                                {/* TODO */}
                                <h1>PAGAR</h1>
                                <Chip
                                    sx={{ my: 2 }}
                                    label="Pagada"
                                    variant='outlined'
                                    color='success'
                                    icon={<CreditScoreOutlined />}
                                />
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </ShopLayout>
    )
}

export default OrderPage