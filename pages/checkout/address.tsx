import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { ShopLayout } from '../../components/layout'

const AddressPage = () => {
  return (
    <ShopLayout title={'Dirección'} pageDescription={'Confirmar dirección del destino'}>
        <Typography variant='h1' component='h1' sx={{mt: 2}}>Dirección</Typography>
        <Grid container spacing={2} sx={{mt: 3}}>
            <Grid item xs={12} sm={6}>
                <TextField label='Nombre' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Apellido' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Dirección' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Dirección 2 (Opcional)' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Codigo Postal' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Ciudad' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <Select 
                        variant='filled'
                        label="País"
                        value={1}
                    >
                        <MenuItem value={0}>Costa Rica</MenuItem>
                        <MenuItem value={1}>España</MenuItem>
                        <MenuItem value={2}>Argentina</MenuItem>
                        <MenuItem value={3}>México</MenuItem>
                        <MenuItem value={4}>Colombia</MenuItem>
                        <MenuItem value={5}>Chile</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Teléfono' variant='filled' fullWidth />
            </Grid>
        </Grid>

        <Box sx={{mt: 5}} display='flex' justifyContent='center'>
            <Button 
                color='secondary'
                className='circular-btn'
                size='large'
            >Revisar Pedido</Button>
        </Box>

    </ShopLayout>
  )
}

export default AddressPage
