import { Grid, Typography } from "@mui/material";
import { FC, useContext } from "react";
import { CartContext } from "../../context";

interface Props {
    orderValues?: {
        numberOfItems: number;
        subtotal: number;
        taxRate: number;
        total: number;
    }
}

export const CartOrderSummary: FC<Props>  = ({orderValues}) => {

    const {numberOfItems, subtotal, total, taxRate } =useContext(CartContext);

    const summaryValues = orderValues ? orderValues : {numberOfItems, subtotal, total, taxRate }

  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography>N Productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{summaryValues.numberOfItems}  {summaryValues.numberOfItems > 1 ? 'Productos' : 'Producto'}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>SubTotal:</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{summaryValues.subtotal} €</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAC_RATE) * 100}%)</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{summaryValues.taxRate} €</Typography>
        </Grid>

        <Grid item xs={6} sx={{mt:2}}>
            <Typography variant="subtitle1">Total:</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end' sx={{mt:2}}>
            <Typography variant="subtitle1">{summaryValues.total} €</Typography>
        </Grid>
    </Grid>
  )
}