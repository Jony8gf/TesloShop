import type { NextApiRequest, NextApiResponse } from 'next';
import { IOrder } from '../../../interfaces';
import { db } from '../../../database';
import { Order } from '../../../models';
import { getToken } from 'next-auth/jwt';

type Data = 
    | { message: string }
    | IOrder[]

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method){
        case 'GET':
            return getOrders(req, res);
        default :
            res.status(400).json({ message: 'Bad Request' })
    }
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();
    const orders = await Order.find()
                            .sort({ createdAt: 'desc'})
                            .populate('user', 'name email')
                            .lean();
    await db.disconnect();
    res.status(200).json(orders);
}
