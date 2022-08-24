import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database';
import { IOrder, IOrderItem, IProduct } from '../../../interfaces';
import { Order, Product } from '../../../models';

type Data = 
| {message: string}
| IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'DELETE':
            console.log("LLegue ProductsCookiesGet");
            return getProductsCookies(req, res);
        default:
            res.status(400).json({ message: 'Bad Request' })
    }
}

const getProductsCookies = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    console.log("LLegue ProductsCookiesGet 2");

    
    const { userId = '', cookies = [] } = req.body;
    console.log("Cookies: ");
    console.log({cookies});
    console.log("UserId: ");
    console.log({userId});

    const orders = await Order.find({user: userId}).select('orderItems');
    // const {orderItems} = orders.orderItems!;
    // const orderJson = JSON.parse(JSON.stringify(orders));
    // orders.length

    const orderItems : IOrderItem[] = [];

    for(var i = 0; i < orders.length ; i++){
        console.log("Numero: "+ i + " -> " + orders[i].orderItems);
        const iOrderItem : any = orders[i].orderItems;
        orderItems.push(iOrderItem);
    }

    console.log(orderItems);

    const titles : any[] = [];

    for(var i = 0; i < orderItems.length ; i++){
        console.log("Title: "+ i + " -> " + orderItems[i].title);
        const titleItem= orderItems[i].title;
        titles.push(titleItem);
    }


    console.log(titles);
    
    


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

    return res.status(200).json(updateProducts);
}