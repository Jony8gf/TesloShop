import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ShopLayout } from '../components/layout'
import { ProductList } from '../components/products'
import { initialData } from '../database/products'
import { IProduct } from '../interfaces'

const Home: NextPage = () => {
  return (
    <ShopLayout title={'TesloShop'} pageDescription={'Encuentra los mejores de Teslo aquí'}>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{mb:1}}>Todos los productos</Typography>

      {/* TODO  _iD Y IProduct*/}
      <ProductList products={initialData.products as any} />
    
    </ShopLayout>
  )
}

export default Home
