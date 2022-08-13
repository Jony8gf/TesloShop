import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Order, Product } from '../../../models';

type Data = 
    |{ message: string }
    | IOrder

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){
        case 'POST':
            return createOrder(req, res);
        default :
            res.status(400).json({ message: 'Bad Request' })
    }
    
    res.status(200).json({ message: 'Example' })
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {orderItems, total} = req.body as IOrder;

    //Verificar Sesion del usuario
    const session: any = await getSession({req});

    if(!session){
        res.status(401).json({ message: 'No autorizado, debe de estar autenticado' })
    }
    //Crar un arreglo de productos que la persona tiene
    const produtsIds = orderItems.map(p => p._id);
    await db.connect();

    const dbProducts = await Product.find({_id: {$in: produtsIds} });
    console.log(dbProducts);

    try{
        const subtotal = orderItems.reduce( (prev, current) => {
            
            const currentPrice = dbProducts.find(prod => prod.id === current._id)!.price;

            if(!currentPrice){
                throw new Error('Verifique el carrito de nuevo, producto no existe');
            }
            return (currentPrice * current.quantity) + prev
        }, 0);

        const taxRate = subtotal * Number(process.env.NEXT_PUBLIC_TAC_RATE || 0.01);
        const backendTotal = subtotal + taxRate;

        if(total !== backendTotal){
            throw new Error('El total no cuadra');
        }

        //Todo okay hasta este punto
        const userId = session.user._id;
        const newOrder = new Order({...req.body, isPaid: false, user: userId});
        await newOrder.save();
        await db.disconnect();
        return res.status(201).json(newOrder);

    }catch(error: any){
        await db.disconnect();
        console.log(error);
        return res.status(400).json({message: error.message || "Revosp logs del servidor"});
    }
}
