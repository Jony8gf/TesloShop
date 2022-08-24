import { Typography } from '@mui/material'
import Cookies from 'js-cookie'
import type { GetServerSideProps, NextPage } from 'next'
import { getToken } from 'next-auth/jwt'
import { useEffect, useState, useMemo } from 'react'
import { tesloApi } from '../api'
import { ShopLayout } from '../components/layout'
import { ProductList, ProductListCookies } from '../components/products'
import { FullScreenLoading } from '../components/ui'
import { useProducts } from '../hooks'
import { IProduct } from '../interfaces'

interface Props {
  session: any
}

const HomePage: NextPage<Props> = ({ session }) => {

  const { products, isError, isLoading } = useProducts('/products');
  const [productsCookies, setProductsCookies] = useState<any[]>();

  useMemo(() => {

    tesloApi.delete('admin/productscookies', { data: { cookies: Cookies.get('token'), userId: session.user._id || null } }).then(res => {
      if (res.data) {
        setProductsCookies(res.data);
      }
    });

  }, [Cookies.get('token'), session.user._id])

  if (isError) return <div>failed to load</div>
  if (!products) return <FullScreenLoading />
  if (!productsCookies) return <FullScreenLoading />

  return (
    <ShopLayout title={'TesloShop - Home'} pageDescription={'Encuentra los mejores de Teslo aquí'}>

      <Typography variant='h1' component='h1'>Tienda</Typography>


      {/* TODO  _iD Y IProduct*/}
      <Typography variant='h2' sx={{ mb: 3, mt: 3, fontWeight: 'bolder' }}>Productos Recomendados para ti</Typography>
      <ProductListCookies products={productsCookies as IProduct[]} />

      <Typography variant='h2' sx={{ mb: 3, mt: 5, fontWeight: 'bolder' }}>Todos los productos</Typography>
      <ProductList products={products} />

    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  return {
    props: {
      session
    }
  }
}

export default HomePage
