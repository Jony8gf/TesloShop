import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

type Data = 
| {message: string}
| IProduct[]

export default function hadler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res)
        // case 'POST':
        //     return postEntry(req, res);
        default:
            return res.status(400).json({ message: 'Endpoint No existe' })
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {gender = 'all'} = req.query;

    let condition = {};

    if(gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)){
        condition = {gender};
    }

    await db.connect();
    const products = await Product.find(condition)
                                    .select('title images price inStock slug')
                                    .lean()
    await db.disconnect()
    res.status(200).json(products);
}