import React from 'react'
import { ShopLayout } from '../../components/layout'
import { Chip, Grid, IconButton, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { ArrowRight } from '@mui/icons-material'
import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { IOrder } from '../../interfaces'
import { getSession } from 'next-auth/react'
import { dbOrders } from '../../database'

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 100},
    {field: 'fullName', headerName: 'Nombre Completo', width: 300},
    {
        field: 'paid', 
        headerName: 'Pagada',
        description: 'Muestra información si esta pagada la orden',
        width: 200,
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid 
                    ? <Chip color="success"  label="Pagada" variant="outlined"/>
                    : <Chip color="error"  label="No Pagada" variant="outlined"/>
            )
        }
    },
    {
        field: 'orden', 
        headerName: 'Ver orden',
        width: 50,
        sortable: false,
        renderCell: (params: GridValueGetterParams) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref >
                        <IconButton>
                            <ArrowRight />
                        </IconButton>
                </NextLink>
            )
        }
    },
]

interface Props{
    orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({orders}) => {

    const rows = orders.map((order, idx) => ({
        id: idx + 1,
        paid: order.isPaid,
        fullName: order.shippingAddress.firstName + " " + order.shippingAddress.lastName,
        orderId: order._id
    }));

  return (

    <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes de compra del cliente'}>
        <Typography variant="h1" component='h1'>Historial de ordenes</Typography>

        <Grid container>
            <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                <DataGrid 
                    columns={columns} 
                    rows={rows} 
                    pageSize={10}
                    rowsPerPageOptions={[10,20,50]}
                />
            </Grid>
        </Grid>
    </ShopLayout>

  )
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    
    const session:any = await getSession({req});

    if(!session){
        return{
            redirect: {
                destination: `/auth/login?p=/orders/history`,
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id);
    

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage