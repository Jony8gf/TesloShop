import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layout'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { useProducts } from '../../hooks'


const MenPage: NextPage = () => {
 
  const {products, isError, isLoading} =  useProducts('/products?gender=men');

  if (isError) return <div>failed to load</div>
  if (!products) return <FullScreenLoading />

  console.log(products)

  return (
    <ShopLayout title={'TesloShop - Men'} pageDescription={'Encuentra los mejores de Teslo para hombres'}>
      
      <Typography variant='h1' component='h1'>Hombres</Typography>
      <Typography variant='h2' sx={{mb:1}}>Todos los productos para hombres</Typography>

      {/* TODO  _iD Y IProduct*/}
      <ProductList products={products} />
    
    </ShopLayout>
  )
}

export default MenPage
