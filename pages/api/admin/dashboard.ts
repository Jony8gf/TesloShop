import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders: number;
    paidOrders: number; //isPaid true
    noPaidOrders: number;
    numberOfClients: number; //role: Client
    numberOfProducts: number;
    productsWithNoInventory: number; // InStock 0
    lowInventory: number; //Productos con menos de 10 
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    await db.connect();

    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
            Order.count(),
            Order.find({isPaid: true}).count(),
            User.find({role: 'client'}).count(),
            Product.count(),
            Product.find({inStock: 0}).count(),
            Product.find({inStock: {$lte: 10}}).count()
    ])

    await db.disconnect();

    res.status(200).json({
        numberOfOrders,
        paidOrders,
        noPaidOrders: numberOfOrders - paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    })
}