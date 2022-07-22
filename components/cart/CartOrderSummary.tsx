import { Grid, Typography } from "@mui/material"

export const CartOrderSummary = () => {
  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography>N Productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>3 items</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>SubTotal:</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>155,30 €</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography>Impuestos 15%</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>35,34 €</Typography>
        </Grid>

        <Grid item xs={6} sx={{mt:2}}>
            <Typography variant="subtitle1">Total:</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end' sx={{mt:2}}>
            <Typography variant="subtitle1">187,34 €</Typography>
        </Grid>
    </Grid>
  )
}