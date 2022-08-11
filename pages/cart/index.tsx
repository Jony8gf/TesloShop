import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material"
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { CartList, CartOrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layout"
import { CartContext } from "../../context";


const CartPage = () => {

    const { numberOfItems, isLoaded, cart } = useContext(CartContext);
    const router = useRouter();

    useEffect(() => {

        if (isLoaded && cart.length === 0) {
            router.replace('/cart/empty');
        }

    }, [isLoaded, cart, router])


    if( !isLoaded || cart.length === 0){
        return(<></>)
    }else{
        return (
            <ShopLayout title={`Carrito - ${numberOfItems} ${numberOfItems > 1 ? 'Productos' : 'Producto'}`} pageDescription={"Carrito de compras de la tienda"}>
                <Typography variant="h1" component='h1'>Carrito</Typography>
    
                <Grid container>
                    <Grid item xs={12} sm={7}>
                        <CartList editable={true} />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Card className="summary-card">
                            <CardContent>
                                <Typography variant='h2'>Orden</Typography>
                                <Divider sx={{ my: 1 }} />
    
                                {/* Orden Summary */}
                                <CartOrderSummary />
    
                                <Box sx={{ mt: 3 }}>
                                    <Button 
                                        color='secondary' 
                                        className="circular-btn" 
                                        fullWidth
                                        onClick={() => router.replace('/checkout/address')}
                                    > Checkout
                                    </Button>
                                </Box>
    
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
    
            </ShopLayout>
    
        )
    }

    
}

export default CartPage