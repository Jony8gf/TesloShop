import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layout'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { useProducts } from '../../hooks'


const WomenPage: NextPage = () => {
 
  const {products, isError, isLoading} =  useProducts('/products?gender=woman');

  if (isError) return <div>failed to load</div>
  if (!products) return <FullScreenLoading />

  return (
    <ShopLayout title={'Jony Shop - Women'} pageDescription={'Encuentra los mejores productos para mujeres'}>
      
      <Typography variant='h1' component='h1'>Mujeres</Typography>
      <Typography variant='h2' sx={{mb:1}}>Todos los productos para mujeres</Typography>

      {/* TODO  _iD Y IProduct*/}
      <ProductList products={products} />
    
    </ShopLayout>
  )
}

export default WomenPage