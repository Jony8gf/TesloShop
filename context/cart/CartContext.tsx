import { createContext } from 'react';
import { ICartProduct } from '../../interfaces';

interface ContextProps{
    cart: ICartProduct[];
    numberOfItems: number;
    subtotal: number;
    taxRate: number;
    total: number;

    //Methods   
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeProductInCart: (product: ICartProduct) => void;
}

export const CartContext = createContext({} as ContextProps);