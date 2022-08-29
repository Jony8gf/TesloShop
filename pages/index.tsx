import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../components/layout'
import { ProductList } from '../components/products'
import { FullScreenLoading } from '../components/ui'
import { useProducts } from '../hooks'


const HomePage: NextPage = () => {
  const {products, isError, isLoading} =  useProducts('/products');

  if (isError) return <div>failed to load</div>
  if (!products) return <FullScreenLoading />

  return (
    <ShopLayout title={'Jony Shop - Home'} pageDescription={'Encuentra los mejores productos aquí en Jony Shop'}>
      
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{mb:1}}>Todos los productos</Typography>

      {/* TODO  _iD Y IProduct*/}
      <ProductList products={products} />
    
    </ShopLayout>
  )
}

export default HomePage
