import React, { FC, useMemo, useState } from 'react'
import NextLink from 'next/link'
import { Card, CardActionArea, CardMedia, Grid, Link } from '@mui/material'
import { IProduct } from '../../interfaces'

interface Props{
    product: IProduct;
}

export const ProductCardCookies:FC<Props> = ({product}) => {
    
    const [isHovered, setIsHovered] = useState(false);

    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const productImage = useMemo(() => {
        return isHovered
          ? product.images[1]
          : product.images[0];

    }, [isHovered, product.images])
    
    return (
        <Grid item
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card>
                <NextLink href={`/product/${product.slug}`} passHref prefetch={false} >
                    <Link>
                        <CardActionArea>
                            {/* {
                                product.inStock === 0 && 
                                <Chip 
                                    color="error"
                                    label="No hay disponibles" 
                                    sx={{position: 'absolute', zIndex: 99, top: '10px', left: '10px'}}
                                />
                            } */}
                            <CardMedia
                                className='fadeIn'
                                component='img'
                                image={productImage}
                                alt={product.title}
                                onLoad={() => setIsImageLoaded(true)}
                                sx={{height: 400, width: 450}}
                            />
                        </CardActionArea>
                    </Link>
                </NextLink>
            </Card>

        </Grid>
    )
}
