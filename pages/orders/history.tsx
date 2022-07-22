import React from 'react'
import { ShopLayout } from '../../components/layout'
import { Chip, Grid, IconButton, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { ArrowRight } from '@mui/icons-material'
import NextLink from 'next/link'

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
                <NextLink href={`/orders/${params.row.id}`} passHref >
                        <IconButton>
                            <ArrowRight />
                        </IconButton>
                </NextLink>
            )
        }
    },
]

const rows = [
    { id: 1, paid: false, fullName: 'Jonathan'},
    { id: 2, paid: false, fullName: 'Jose Miguel'},
    { id: 3, paid: true, fullName: 'Angel'},
    { id: 4, paid: false, fullName: 'Andoni'},
    { id: 5, paid: true, fullName: 'Abascal'},
    { id: 6, paid: false, fullName: 'Jacobo'},
    { id: 7, paid: true, fullName: 'Alexis'},
    { id: 8, paid: true, fullName: 'Selioxx'}
]

const HistoryPage = () => {
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

export default HistoryPage