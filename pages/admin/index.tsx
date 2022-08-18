import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layout';
import { FullScreenLoading } from '../../components/ui';
import { DashboardSummaryResponse } from '../../interfaces';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';

const DashboardPage = () => {

    const { data, error } = useSWR<DashboardSummaryResponse>('api/admin/dashboard', {
          refreshInterval: 30 * 1000
    });

    const [refresh, setRefresh] = useState(30);

    useEffect(() => {

        const interval = setInterval(() => {
            setRefresh(refresh => refresh > 0 ? refresh - 1: 30);
        }, 1000);
        console.log(data)
      return () => clearInterval(interval)
    }, []);
    

    if(!error && !data){
        return <FullScreenLoading></FullScreenLoading>
    }

    if(error){
        console.log(error);
        return <Typography color='error'>Error al cargar la información</Typography>
    }

    
    const{
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    } = data!;

    const notPaidOrders = data!.numberOfOrders - data!.paidOrders;

  return (
    <AdminLayout title={'Dashboard'} subtitle={'Estadisticas Generales'} icon={<DashboardOutlined sx={{marginRight: 2}}/>}>

        <Grid container spacing={2}>

            <SummaryTile title={numberOfOrders} subtitle={'Ordenes Totales'} icon={<CreditCardOutlined color='secondary' sx={{fontSize: 40}} />} />
            <SummaryTile title={paidOrders} subtitle={'Ordenes Pagadas'} icon={<AttachMoneyOutlined color='success' sx={{fontSize: 40}} />} />
            <SummaryTile title={notPaidOrders} subtitle={'Ordenes Pendientes'} icon={<CreditCardOffOutlined color='error' sx={{fontSize: 40}} />} />
            <SummaryTile title={numberOfClients} subtitle={'Clientes'} icon={<GroupOutlined color='primary' sx={{fontSize: 40}} />} />
            <SummaryTile title={numberOfProducts} subtitle={'Productos'} icon={<CategoryOutlined color='warning' sx={{fontSize: 40}} />} />
            <SummaryTile title={productsWithNoInventory} subtitle={'Sin Existencias'} icon={<CancelPresentationOutlined color='error' sx={{fontSize: 40}} />} />
            <SummaryTile title={lowInventory} subtitle={'Bajo Inventario'} icon={<ProductionQuantityLimitsOutlined color='warning' sx={{fontSize: 40}} />} />
            <SummaryTile title={refresh} subtitle={'Actualizacion en:'} icon={<AccessTimeOutlined color='secondary' sx={{fontSize: 40}} />} />

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

export default DashboardPage;