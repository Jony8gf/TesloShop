import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layout'
import { ProductList } from '../../components/products'
import { GetServerSideProps } from 'next'
import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces'
import { idID } from '@mui/material/locale'

interface Props{
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}


const SearchPage: NextPage<Props> = ({products, foundProducts, query}) => {

  return (
    <ShopLayout title={'Jony Shop - Search'} pageDescription={'Encuentra los mejores aquí'}>
      
      <Typography variant='h1' component='h1'>Buscar producto</Typography>

      {
        foundProducts 
        ? <Typography variant='h2' sx={{mb:1}}>Se ha buscado: <strong>{query}</strong></Typography> 
        :
        <>
            <Typography variant='h2' sx={{mb:1}}>No se han encontrado productos <strong>{query}</strong></Typography>
            <Typography variant='subtitle2' sx={{mb:1}}>Se han devuelto productos que le pueden interesar</Typography>
        </>     
      }

      <Typography variant='h2' sx={{mb:1}}>Hay {products.length} resultados</Typography>

      {/* TODO  _iD Y IProduct*/}
      <ProductList products={products} />
    
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({params}) => {
    
    const {query = ''} = params as {query: string};

    if(query.length === 0){
        return{
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await dbProducts.getProductsByTerm(query);
    const foundProducts = products.length > 0;
    
    //TODO Retornar otros productos
    if(!foundProducts){
        products = await dbProducts.getAllProducts();
    }

    return {
        props: {
            products,
            foundProducts, 
            query
        }
    }
}

export default SearchPage
