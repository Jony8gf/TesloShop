import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import React from 'react';
import { AdminLayout } from '../../components/layout';
import { IProduct } from '../../interfaces';
import useSWR from 'swr';
import { FullScreenLoading } from '../../components/ui';
import { getToken } from 'next-auth/jwt';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link'

const columns: GridColDef[] = [
    {
        field: 'img',
        headerName: 'Foto',
        renderCell: ({row} :GridValueGetterParams) => {
            return (
                <a href={`/product/${row.slug}`} target="_blank" rel='noreferrer'>
                    <CardMedia 
                        component='img'
                        alt={row.title}
                        image={`/products/${row.img}`}
                    />
                </a>
            )
        }
    },
    {
        field: 'title', 
        headerName: 'Nombre del producto', 
        width: 250,
        renderCell: ({row} :GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/products/${row.slug}`} passHref>
                    <Link underline='always'>{row.title}</Link>
                </NextLink>
            )
        }
    },
    {field: 'gender', headerName: 'Genero'},
    {field: 'type', headerName: 'Tipo'},
    {field: 'inStock', headerName: 'En Stock'},
    {field: 'price', headerName: 'Precio'},
    {field: 'sizes', headerName: 'Tallas', width: 250}
];

const ProductsPage = () => {


    const { data, error } = useSWR<IProduct[]>('/api/admin/products');

    if( !data && !error) return <FullScreenLoading />

    const rows = data!.map( product => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug
    }));

  return (
    <AdminLayout title={'Listado de Productos'} subtitle={`Manteniento de Productos (${data?.length})`} icon={<CategoryOutlined sx={{marginRight: 2}}/>}>
        <Box display="flex" justifyContent='end' sx={{ mb: 2}}>
            <Button
                startIcon={<AddOutlined />}
                color='secondary'
                href="/admin/products/new"
            >
                Crear Producto
            </Button>
        </Box>
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

export default ProductsPage