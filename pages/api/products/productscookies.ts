import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data = 
| {message: string}
| IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            console.log("LLegue ProductsCookiesGet");
            return getProductsCookies(req, res);
        default:
            res.status(400).json({ message: 'Bad Request' })
    }
}

const getProductsCookies = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    console.log("LLegue ProductsCookiesGet 2");

    const { userId = '', cookies = ''} = req.body;
    console.log("Cookies: "+cookies);
    console.log("UserId: "+userId);

    let condition = {};

    // if(gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)){
    //     condition = {gender};
    // }

    await db.connect();
    const products = await Product.find(condition)
                                    .select('title images price inStock slug')
                                    .lean()
    await db.disconnect();

    const updateProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });
        return product;
    });

    res.status(200).json(updateProducts);
}