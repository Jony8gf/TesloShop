import mongoose, {Schema, Model, model} from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema({ 
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role:{
        type: String,
        enum:{
            values: ['admin', 'client'],
            message: '{VALUE} no es un rol valido',
            default: 'client',
            required: true
        }
    }
},{
    timestamps: true
});

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;