import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined, ReceiptLongOutlined } from '@mui/icons-material';
import { Typography, Grid, Card, CardContent, Divider, Box, Chip } from '@mui/material';
import React  from 'react';
import { CartList, CartOrderSummary } from '../../../components/cart';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';
import { countries } from '../../../utils';
import { AdminLayout } from '../../../components/layout';
import { getToken } from 'next-auth/jwt';


interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

    return (
        <AdminLayout title={"Resumen de la orden: "} subtitle={`${order._id}`} icon={<ReceiptLongOutlined sx={{marginRight: 2}}/>}>

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

                                <Box display="flex" flexDirection="column">
                                    {
                                        order.isPaid ? (
                                            <Chip
                                                sx={{ my: 2, flex: 1 }}
                                                label="Pagada"
                                                variant='outlined'
                                                color='success'
                                                icon={<CreditScoreOutlined />}
                                            />
                                        ) : (
                                            <Chip
                                                sx={{ my: 2, flex: 1 }}
                                                label="Pendiente de pago"
                                                variant='outlined'
                                                color='error'
                                                icon={<CreditCardOffOutlined />}
                                            />
                                        )
                                    }
                                </Box>

                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;
    const session: any = await getSession({ req });

    const sessionTokken: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if ( !sessionTokken ) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false
            }
        }
    }

    const validRoles = ['admin'];
    if(!validRoles.includes(session.user.role)){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

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
                destination: `/admin/orders`,
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