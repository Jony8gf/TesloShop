import axios from 'axios';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IPaypal } from '../../../interfaces';
import { Order } from '../../../models';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return payOrder(req, res)
        default:
            return res.status(400).json({ message: 'Endpoint No existe' });
    }
}


const getPaypalBearerToken = async():Promise<string|null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');

    try{
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers:{
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        return data.access_token;

    }catch (err) {
        if (axios.isAxiosError(err)) {
            console.log(err.response?.data)
        }
        else {
            console.log(err);
        }

        return null;
    }
}

const payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const session: any = await getSession({req});

    if(!session){
        res.status(401).json({ message: 'No autorizado, debe de estar autenticado' })
    }

    const paypalBearerToken = await getPaypalBearerToken();

    if(!paypalBearerToken){
        return res.status(400).json({ message: 'No se pudo generar/confirmar el TOKEN de Paypal' });
    }

    const {transactionId = '', orderId = ''} = req.body;

    if(!isValidObjectId(orderId)) return res.status(400).json({ message: 'Numero de orden no reconocida por el sistema' });

    const {data} = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,{
        headers: {
            'Authorization': `Bearer ${paypalBearerToken}`,
        }
    });

    if(data.status !== 'COMPLETED'){
        return res.status(401).json({ message: 'Orden no reconocida' });
    }

    await db.connect();
    const dbOrder = await Order.findById(orderId);

    if(!dbOrder){
        await db.disconnect();
        return res.status(400).json({ message: 'La orden no existe' });
    }

    if(dbOrder.total !== Number(data.purchase_units[0].amount.value))
    {
        await db.disconnect();
        return res.status(400).json({ message: 'Los montos de PayPal y nuestra orden no son compatibles' });
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    dbOrder.save()
    await db.disconnect();


    return res.status(200).json({ message: 'La orden se ha pagado con exíto' }); 
}
