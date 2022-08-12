

import { createContext, FC, useEffect, useReducer } from 'react';
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';
import Cookies from 'js-cookie';
import { tesloApi } from '../../api';

export interface CartState{
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subtotal: number;
    taxRate: number;
    total: number;

    shippingAddress?: ShippingAddress;
}


const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    taxRate: 0,
    total: 0,
    shippingAddress: undefined,
}

interface Props {
    children?: React.ReactNode | undefined,
}

export const CartProvider:FC<Props> = ({children}) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    //Efecto guardar cookies de carrito
    useEffect(() =>{
        Cookie.set('cart', JSON.stringify(state.cart));
    },[state.cart])

    useEffect(() =>{

        const numberOfItems = state.cart.reduce( (prev, current) => current.quantity + prev, 0);
        const subtotal = state.cart.reduce( (prev, current) => (current.price * current.quantity) + prev, 0);
        const taxRate = subtotal * Number(process.env.NEXT_PUBLIC_TAC_RATE || 0.01);
        const total = subtotal + taxRate;

        const orderSummary = {
            numberOfItems,
            subtotal,
            taxRate,
            total
        }
        dispatch({type: '[Cart] - Update Order summary', payload: orderSummary});
    },[state.cart])

    //Efecto recargar carrito
    useEffect(() =>{
        try{
            const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
            dispatch({type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts})
        }catch(error){
            dispatch({type: '[Cart] - LoadCart from cookies | storage', payload: []})
        }
    },[])

    useEffect(() => {

        if(Cookies.get("firstName")){
            const shippingAddress = {
                firstName: Cookies.get("firstName") || '',
                lastName: Cookies.get("lastName") || '',
                address: Cookies.get("address") || '',
                address2: Cookies.get("address2") || '',
                zip: Cookies.get("zip") || '',
                city: Cookies.get("city") || '',
                country: Cookies.get("country") || '',
                phone: Cookies.get("phone") || '',
            }
            dispatch({type: '[Cart] - LoadAddress from Cookies', payload: shippingAddress})
        }      
    }, [])
    


    const addProductToCart = (product: ICartProduct) => {

        //! Nivel 1
        // dispatch({type: '[Cart] - Add Product', payload: product})

        //! Nivel 2
        // const productsInCart = state.cart.filter(p => p._id !== product._id && p.size !== product.size);
        // dispatch({type: '[Cart] - Add Product', payload: [...productsInCart, product]})

        //! Nivel FINAL
        const productInCart = state.cart.some(p => p._id === product._id);
        if(!productInCart) return dispatch({type: '[Cart] - Update products in cart', payload: [...state.cart, product]})

        const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size);
        if(!productInCartButDifferentSize) return dispatch({type: '[Cart] - Update products in cart', payload: [...state.cart, product]})

        //Acumular
        const updateProducts = state.cart.map(p => {
            
            if(p._id !== product._id) return p
            if(p.size !== product.size) return p

            //Actualizar cantidad
            p.quantity += product.quantity;

            return p;
        })

        dispatch({type: '[Cart] - Update products in cart', payload: updateProducts});

    }

    const updateCartQuantity = (product : ICartProduct) => {
        dispatch({type: '[Cart] - Change cart quantity', payload: product})
    }

    const removeProductInCart =  (product : ICartProduct) => {
        dispatch({type: '[Cart] - Remove product in cart', payload: product})
    }

    const updateAddress = (address: ShippingAddress) => {
        Cookies.set("firstName",address.firstName);
        Cookies.set("lastName",address.lastName);   
        Cookies.set("address",address.address);    
        Cookies.set("address2",address.address2 || '');     
        Cookies.set("zip",address.zip); 
        Cookies.set("city",address.city);
        Cookies.set("country",address.country);      
        Cookies.set("phone",address.phone);
        dispatch({type: '[Cart] - Update Address',payload: address});
    }

    const createOrder = async () => {


        if(!state.shippingAddress){
            throw new Error('No hay dirección de entrega');
        }

        const body: IOrder = {
            orderItems: state.cart.map(p => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subtotal: state.subtotal,
            taxRate: state.taxRate,
            total: state.total,
            isPaid: false
        }

        try{

            const {data} = await tesloApi.post('/orders', body);

            console.log(data);


        }catch(error){
            console.log(error)
        }

    }


    return (
        <CartContext.Provider value={{
            ...state, 

            //Methodos
            addProductToCart, 
            updateCartQuantity, 
            removeProductInCart, 
            updateAddress,

            //Orders
            createOrder
        }}>
            {children}
        </CartContext.Provider>
    )
}