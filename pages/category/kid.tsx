import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layout'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { useProducts } from '../../hooks'


const KidPage: NextPage = () => {
 
  const {products, isError, isLoading} =  useProducts('/products?gender=kid');

  if (isError) return <div>failed to load</div>
  if (!products) return <FullScreenLoading />

  return (
    <ShopLayout title={'Jony Shop - Kids'} pageDescription={'Encuentra los mejores de productos para niños'}>
      
      <Typography variant='h1' component='h1'>Niños</Typography>
      <Typography variant='h2' sx={{mb:1}}>Todos los productos para niños</Typography>

      {/* TODO  _iD Y IProduct*/}
      <ProductList products={products} />
    
    </ShopLayout>
  )
}

export default KidPage
