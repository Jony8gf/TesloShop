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
            return getProductsCookies(req, res);
        default:
            res.status(400).json({ message: 'Bad Request' })
    }
}

const getProductsCookies = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    // console.log("LLegue ProductsCookiesGet 2");
    
    const { userId = '', cookies = [] } = req.body;
    // console.log("Cookies: ");
    // console.log({cookies});
    // console.log("UserId: ");
    // console.log({userId});

    const orders = await Order.find({user: userId}).select('orderItems');

    const titles : any[] = [];

    for(var i = 0; i < orders.length ; i++){
        // console.log("Numero: "+ i + " -> " + orders[i].orderItems);
        const orderItem : string =  ` ${orders[i].orderItems.toString()} `;
        const title = orderItem.split(',');
        const [first, second] = title[1].split(":");
        titles.push(second);
    }
    
    const titlesOrders : string[] = [];

    titles.map(t => {
        const genero = t.toLowerCase();
        if(genero.includes("men")){
            titlesOrders.push('men');
        }
        if(genero.includes("woman")){
            titlesOrders.push('woman');
        }
        if(genero.includes("kid")){
            titlesOrders.push('kid');
        }
        if(genero.includes("unisex")){
            titlesOrders.push('unisex');
        }
    });

    // console.log(titlesOrders);

    const resultTitleOrders = titlesOrders.filter((item,index)=>{
        return titlesOrders.indexOf(item) === index;
      });

    let condition = {};

    if (resultTitleOrders){
        const randomCookie = Math.floor(Math.random()  * resultTitleOrders.length);
        // console.log(randomCookie)
        const gender = resultTitleOrders[randomCookie]
        condition = {gender};
    }

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

    // console.log(updateProducts)

    res.status(200).json(JSON.parse(JSON.stringify(updateProducts)));
}