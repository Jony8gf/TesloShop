import { Grid, Typography } from "@mui/material"
import { useContext } from "react"
import { CartContext } from "../../context"

export const CartOrderSummary = () => {

    const {numberOfItems, subtotal, total, taxRate } =useContext(CartContext);

  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography>N Productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{numberOfItems}  {numberOfItems > 1 ? 'Productos' : 'Producto'}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>SubTotal:</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{subtotal} €</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAC_RATE) * 100}%)</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{taxRate} €</Typography>
        </Grid>

        <Grid item xs={6} sx={{mt:2}}>
            <Typography variant="subtitle1">Total:</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end' sx={{mt:2}}>
            <Typography variant="subtitle1">{total} €</Typography>
        </Grid>
    </Grid>
  )
}