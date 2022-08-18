import { ArrowRight, ConfirmationNumberOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { Chip, Grid, IconButton } from '@mui/material';
import NextLink from 'next/link'
import React from 'react';
import { AdminLayout } from '../../components/layout';
import { IOrder, IUser } from '../../interfaces';
import useSWR from 'swr';
import { FullScreenLoading } from '../../components/ui';
import { getToken } from 'next-auth/jwt';
import { GetServerSideProps } from 'next';

const columns: GridColDef[] = [
    {field: 'id', headerName: 'Numero Orden', width: 300},
    {field: 'email', headerName: 'Correo', width: 200},
    {field: 'name', headerName: 'Nombre completo', width: 250},
    {field: 'total', headerName: 'Total', width: 100},
    {
        field: 'isPaid', 
        headerName: 'Pagada', 
        width: 150,
        renderCell: ({row}: GridValueGetterParams) => {
            return row.isPaid 
                ? (<Chip variant='outlined' label="Pagada" color='success' />)
                :(<Chip variant='outlined' label="Pendiente" color='error' />)
        }
    },
    {field: 'numberOfItems', headerName: 'No.Productos', align:'center'},
    {
        field: 'check', 
        headerName: 'Ver orden',
        width: 50,
        sortable: false,
        renderCell:  ({row}: GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/orders/${row.id}`} passHref >
                        <IconButton>
                            <ArrowRight />
                        </IconButton>
                </NextLink>
            )
        }
    },
    {field: 'createdAt', headerName: 'Creada en' },
];

const OrdersPage = () => {


    const { data, error } = useSWR<any[]>('/api/admin/orders');

    if( !data && !error) return <FullScreenLoading />

    const rows = data!.map(order => ({
        id: order._id,
        email : (order.user as IUser) ? order.user.name : 'Nombre no encontrado',
        name  : (order.user as IUser) ? order.user.email : 'Email no encontrado',
        total: order.total,
        isPaid: order.isPaid,
        numberOfItems: order.numberOfItems,
        createdAt: order.createdAt
    }));

  return (
    <AdminLayout title={'Listado de Ordenes'} subtitle={'Manteniento de Ordenes'} icon={<ConfirmationNumberOutlined sx={{marginRight: 2}}/>}>
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
    </AdminLayout>
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

    const validRoles = ['admin'];
    if(!validRoles.includes(session.user.role)){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default OrdersPage