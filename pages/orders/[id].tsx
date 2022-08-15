import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip, CircularProgress } from '@mui/material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import React, { useState } from 'react';
import { CartList, CartOrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layout';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { countries } from '../../utils'
import { tesloApi } from '../../api';
import { useRouter } from 'next/router';
import { display } from '@mui/system';


export type OrderResponseBody = {
    id: string;
    status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED";
};

interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

    const router = useRouter();
    const [isPaying, setIsPaying] = useState(false);

    const onOrderCompleted = async (details: OrderResponseBody) => {

        if (details.status !== 'COMPLETED') {
            return alert('No hay pago en paypal');
        }

        setIsPaying(true);

        try {

            const { data } = await tesloApi.post('/orders/pay', {
                transactionId: details.id,
                orderId: order._id
            });

            router.reload();

        } catch (error) {
            console.log(error);
            setIsPaying(false);
            alert('Error');
        }

    }

    return (
        <ShopLayout title={"Resumen de la orden: " + order._id} pageDescription={"Resumen de la orden de compra"}>
            <Typography variant="h1" component='h1'>Orden: {order._id}</Typography>

            {
                order.isPaid ? (
                    <Chip
                        sx={{ my: 2 }}
                        label="Pagada"
                        variant='outlined'
                        color='success'
                        icon={<CreditScoreOutlined />}
                    />
                ) : (
                    <Chip
                        sx={{ my: 2 }}
                        label="Pendiente de pago"
                        variant='outlined'
                        color='error'
                        icon={<CreditCardOffOutlined />}
                    />
                )

            }

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList products={order.orderItems} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'Productos' : 'Producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            <Typography>{order.shippingAddress?.firstName}</Typography>
                            <Typography>{order.shippingAddress?.lastName}</Typography>
                            <Typography>{order.shippingAddress?.address} {order.shippingAddress?.address2}</Typography>
                            <Typography>{order.shippingAddress?.zip} - {order.shippingAddress?.city}</Typography>
                            <Typography>{countries.countries.find(c => c.code === order.shippingAddress?.country)?.name}</Typography>
                            <Typography>{order.shippingAddress?.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            {/* Orden Summary */}
                            <CartOrderSummary orderValues={{
                                numberOfItems: order.numberOfItems,
                                subtotal: order.subtotal,
                                total: order.total,
                                taxRate: order.taxRate,
                            }} />

                            <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                                {/* TODO */}

                                <Box display="flex"
                                    justifyContent="center"
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                >
                                    <CircularProgress />
                                </Box>

                                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection="column">
                                    {
                                        order.isPaid ? (
                                            <Chip
                                                sx={{ my: 2 }}
                                                label="Pagada"
                                                variant='outlined'
                                                color='success'
                                                icon={<CreditScoreOutlined />}
                                            />
                                        ) : (
                                            <PayPalButtons
                                                createOrder={(data, actions) => {

                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: order.total.toString()
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    console.log(actions)
                                                    return actions.order!.capture().then((details: any) => {
                                                        onOrderCompleted(details);
                                                    });
                                                }}
                                            />
                                        )
                                    }
                                </Box>

                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage