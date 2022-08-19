import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { User } from '../../../models';

type Data = 
| { message: string }
| IUser

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){
        case 'GET':
            return getUserId(req, res);
        default :
            res.status(400).json({ message: 'Bad Request' })
    }
}

const getUserId = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { userId = ''} = req.body;

    if(!isValidObjectId(userId)){
        return res.status(400).json({ message: 'No existe usuario con ese ID' })
    }

    await db.connect();
    const user = await User.findById(userId).select('-password').lean();
    await db.disconnect();

    if(!user){
        return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json(user);
}
