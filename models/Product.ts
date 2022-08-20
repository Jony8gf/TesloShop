import mongoose, {Schema, Model, model} from "mongoose"
import { IProduct } from "../interfaces";

const productSchema = new Schema({
    description: {type: String, required: true, default: ''},
    images: [{type: String }],
    inStock: {type: Number, required: true, default: 0},
    price: {type: Number, required: true, default: 0},
    sizes: [{
        type: String,
        enum:{
            values: ['XS','S','M','L','XL','XXL','XXXL'],
            message: '{VALUE} no es una talla permitida'
        }
    }],
    slug: {type: String, required: true, unique: true},
    tags: [{type: String }],
    title: {type: String, required: true, default: ''},
    type: {
        type: String,
        enum:{
            values: ['shirts','pants','hoodies','hats'],
            message: '{VALUE} no es un tipo valido'
        },
        default: 'shirts'
    },
    gender:{
        type: String,
        enum:{
            values: ['men','woman','kid','unisex'],
            message: '{VALUE} no es una categoria permitida'
        },
        default: 'men'
    }
},{
    timestamps: true
});


productSchema.index({title: 'text', tags: 'text'});

const ProductModel: Model<IProduct> = mongoose.models.Product || mongoose.model('Product', productSchema);

export default ProductModel;