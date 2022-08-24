import React, { FC } from 'react'
import { List } from '@mui/material'
import { IProduct } from '../../interfaces'
import { ProductCardCookies } from './ProductCardCookies'


interface Props{
    products: IProduct[]
}

export const ProductListCookies:FC<Props> = ({products}) => {
  return (
      <List style={{maxHeight: '100%', overflow: 'auto', display: 'flex', marginBottom: 20}} >
          {
            products.map( product => (
             <ProductCardCookies product={product} key={product.slug} />
            ))
          }
      </List>
  )
}
