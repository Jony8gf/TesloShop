import React, { FC } from 'react'
import { ISize } from '../../interfaces';
import { Box } from '@mui/system';
import { Button } from '@mui/material';

interface Props{
    selectedSize?: ISize;
    sizes: ISize[];
}

export const ProductSizeSelector:FC<Props> = ({selectedSize, sizes}) => {
  
    
  
    return (
    <Box>
        {
            sizes.map(size => {
                return (
                    <Button
                        key={size}
                        size='small'
                        className={selectedSize === size ? 'talla-elegida' : 'talla-no-elegida'}

                    >
                        {size}
                    </Button>
                );
            })
        }
    </Box>
  )
}
