import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct, ISize } from '../../../interfaces';
import { Product } from '../../../models';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = 
| { message: string }
| IProduct[]
| IProduct

const validSizes:ISize = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as unknown as ISize;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method){
        case 'GET':
            return getProducts(req, res);
        case 'PUT':
            return updateProduct(req, res);
        case 'POST':
            return createProduct(req, res);
        case 'DELETE':
            return deleteProduct(req, res);
        default :
            res.status(400).json({ message: 'Bad Request' })
    }
}
 
export const orderSizes = (entries: Array<string>): Array<string> => {
 
    const orderOfValues = entries.map(s =>  validSizes.indexOf(s))
    
    return orderOfValues.sort((a,b) => a - b).map(num => {
      return validSizes[num]
    })
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();
    const products = await Product.find()
        .sort({title: 'asc'})
        .lean();

    await db.disconnect();

    //TODO ACTUALIZAR IMAGENES
    const updateProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });
        return product;
    });

    res.status(200).json(updateProducts);

}

const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '', images = [] } = req.body as IProduct;

    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del producto no es válido' });
    }
    
    if ( images.length < 2 ) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }


    //TODO :> LOcalhost:300/products/agdsgsdf.jpg

    try{
        await db.connect();

        const product = await Product.findById(_id);

        if(!product){
            await db.disconnect();
            return res.status(400).json({ message: 'No existe el producto con ese id' });
        } 

        let sizes = req.body.sizes;
        req.body.sizes = orderSizes(sizes)

        //Todo: Eliminar fotos en clodudinary
        product.images.forEach( async(image) => {
            if(!images.includes(image)){
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.');
                // console.log(fileId +" - "+ extension);
                await cloudinary.uploader.destroy(fileId);
            }
        });

        await product.update(req.body);
        await db.disconnect();

        return res.status(200).json(product);

    }catch(error){
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message: 'Ha ocurrido un error inesperado. Revisa la consola del servidor' })
    } 
}

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images = [] } = req.body as IProduct;

    if ( images.length < 2 ) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }

    //TODO :> LOcalhost:300/products/agdsgsdf.jpg

    try{
        await db.connect();

        const productInDb = await Product.findOne({slug: req.body.slug});

        if(productInDb){
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un product con este slug' });
        }

        let sizes = req.body.sizes;
        req.body.sizes = orderSizes(sizes);
        const product = new Product(req.body);
        await product.save();
        
        await db.disconnect();

        return res.status(200).json(product);

    }catch(error){
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message: 'Ha ocurrido un error inesperado. Revisa la consola del servidor' })
    } 
}

const deleteProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {slug = ''}   = req.body;

    try{
        await db.connect();
        const productInDb = await Product.findOne({slug: slug});


        if(!productInDb){
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un product con este slug' });
        }

        const product = await Product.findOneAndRemove({slug: slug});

        productInDb.images.forEach( async(image) => {
            if(image.includes('http')){
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.');
                // console.log(fileId +" - "+ extension);
                await cloudinary.uploader.destroy(fileId);
            }
        });

        await db.disconnect();

        return res.status(200).json({ message: 'Producto borrado correctamente' });

    }catch(error){
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message: 'Ha ocurrido un error inesperado. Revisa la consola del servidor' })
    }

}
