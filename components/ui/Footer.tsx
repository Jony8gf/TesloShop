import { Copyright } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import React from 'react'

const FooterPage = () => {
  return (
    <Box sx={{backgroundColor: 'black', height: 135 }} className='footer'>
        <Box display='flex' justifyContent='center'>
            <Typography variant="h6" align="center" color="white" sx={{marginTop: 2}}>
            TesloShop  {new Date().getFullYear()}
            </Typography>
        </Box>       
        <Typography variant="subtitle1" align="center" color="white" component="p">       
            {' '}
            Todos los derechos reservados para JonyCoding. 
        </Typography>
        <Box display='flex' justifyContent='center'>
            <Typography variant="h6" align="center" gutterBottom color="white">
                Copyright
            </Typography>   
            <Typography variant="h6" align="center" gutterBottom color="white">
                <Copyright sx={{color: 'white', marginTop: 0.5, marginX: 0.5}} />
            </Typography>  
            <Typography variant="h6" align="center" gutterBottom color="white">
                {new Date().getFullYear()}
            </Typography>   
        </Box>
    </Box>
  )
}

export default FooterPage