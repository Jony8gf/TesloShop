import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { AdminLayout } from '../../../components/layout';
import { IProduct } from '../../../interfaces';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { dbProducts } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Input, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { getToken } from 'next-auth/jwt';
import { Controller, useForm } from 'react-hook-form';
import { tesloApi } from '../../../api';
import { Product } from '../../../models';
import { useRouter } from 'next/router';


const validTypes = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

interface FormData {
    _id?: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: string[];
    slug: string;
    tags: string[];
    title: string;
    type: string;
    gender: string;
}

interface Props {
    product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {

    const [newTagValue, setNewTagValue] = useState('');
    const [isImagesSelected, setIsImagesSelected] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const { register, handleSubmit, control, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: product
    });

    useEffect(() => {
    
        const subscription = watch((value, {name, type})=> {

            // console.log(value, {name, type});
            
            if(name === 'title'){  
                const newSlug = value.title?.trim().replaceAll(" ","_").replaceAll("'","").toLocaleLowerCase() || '';
                setValue('slug', newSlug);
            }
        })

        return () => subscription.unsubscribe();

    }, [watch, setValue]);

    const onChangeSize = (size: string) => {
        const currentSizes = getValues('sizes');
        if(currentSizes.includes(size)){
            return setValue('sizes', currentSizes.filter(s => s !== size), {shouldValidate: true} )
        }
        setValue('sizes', [...currentSizes, size], {shouldValidate: true} )
    }

    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();
        setNewTagValue('');
        const currentTags = getValues('tags');

        if(currentTags.includes(newTag)) return;

        currentTags.push(newTag);
    }

    const onDeleteTag = (tag: string) => {
        const updateTags = getValues('tags').filter( t => t !== tag);
        setValue('tags', [...updateTags], {shouldValidate: true})
    }

    const onDeleteImage = (img: string) => {
        setValue('images', getValues('images').filter( i => i !== img), {shouldValidate: true});
    }

    const onFilesSelected = async ({target}: ChangeEvent<HTMLInputElement>) =>{
        if(!target.files || target.files.length === 0) return
        // console.log(target.files);
        
        try{
            for(const file of target.files){
                const formData = new FormData();
                // console.log(file);
                formData.append('file', file);
                const { data } = await tesloApi.post<{message:string}>('admin/upload', formData);
                // console.log(data.message);
                setValue('images', [...getValues('images'), data.message], {shouldValidate: true});
            }
        }catch(error){
            console.log(error)
        }

    }

    const onSubmitForm = async(form: FormData) => {

        setIsImagesSelected(false); 

        if(form.images.length < 2) return setIsImagesSelected(true);

        setIsSaving(true);

        try{
                const { data } = await tesloApi({
                    url: '/admin/products',
                    method: form._id ? 'PUT': 'POST',  // si tenemos un _id, entonces actualizar, si no crear
                    data: form
                });
    
                console.log({data});

            if(!form._id){
                setIsSaving(false);
                router.replace(`/admin/products/${form.slug}`);
            }else{
                setIsSaving(false);
            }

        }catch(error){
            console.log(error);
            setIsSaving(false);
            setIsImagesSelected(false); 
        }

    }

    return (
        <AdminLayout
            title={'Producto'}
            subtitle={`Editando: ${product.title}`}
            icon={<DriveFileRenameOutline />}
        >
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button
                        color="secondary"
                        startIcon={<SaveOutlined />}
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={isSaving}
                    >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={6}>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />

                        <Controller
                            name="description"
                            rules={{
                                required: "Este campo es requerido",
                            }}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Descripción"
                                    variant="filled"
                                    fullWidth
                                    multiline
                                    sx={{ mb: 1 }}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            )}
                        />

                        <TextField
                            label="Inventario"
                            type='number'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('inStock', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'Mínimo de valor cero' }
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />


                        <TextField
                            label="Precio"
                            type='number'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('price', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'Mínimo de valor cero' }
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                            value={ getValues('type') }
                            onChange={ ({target}) => setValue('type', target.value, {shouldValidate: true}) }
                            >
                                {
                                    validTypes.map(option => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio color='secondary' />}
                                            label={capitalize(option)}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                            value={ getValues('gender') }
                            onChange={ ({target}) => setValue('gender', target.value, {shouldValidate: true}) }
                            >
                                {
                                    validGender.map(option => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio color='secondary' />}
                                            label={capitalize(option)}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel 
                                        key={size} 
                                        control={<Checkbox checked={ getValues('sizes').includes(size)} />} 
                                        label={size}
                                        onChange={ () => onChangeSize(size)}
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={6}>

                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('slug', {
                                required: 'Este campo es requerido',
                                validate: (value) => value.trim().includes(' ') ? 'No puede tener espacios en blanco ' : undefined
                            })}
                            error={!!errors.slug}
                            helperText={errors.slug?.message}
                        />


                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={newTagValue}
                            onChange={({target}) => setNewTagValue(target.value)}
                            onKeyUp={ ({code}) => code === 'Space' ? onNewTag() : undefined}
                        />

                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                            component="ul">
                            {
                                getValues('tags').map((tag) => {

                                    return (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            onDelete={() => onDeleteTag(tag)}
                                            color="primary"
                                            size='small'
                                            sx={{ ml: 1, mt: 1 }}
                                        />
                                    );
                                })}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={<UploadOutlined />}
                                sx={{ mb: 3 }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Cargar imagen
                            </Button>
                            <input 
                                ref={ fileInputRef }
                                type="file"
                                multiple
                                accept='image/png, image/gif, image/jpg, image/jpeg'
                                style={{ display: 'none'}}
                                onChange={onFilesSelected}
                            />

                            {isImagesSelected ? 
                                <Chip
                                    label="Es necesario al 2 imagenes"
                                    color='error'
                                    variant='outlined'
                                /> : <></>}
                           

                            <Grid container spacing={2}>
                                {
                                    getValues('images').map(img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ img }
                                                    alt={img}
                                                />
                                                <CardActions>
                                                    <Button fullWidth color="error" onClick={() => onDeleteImage(img)}>
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false
            }
        }
    }

    const validRoles = ['admin'];
    if (!validRoles.includes(session.user.role)) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const { slug = '' } = query;

    let product: IProduct | null;

    if(slug === 'new'){
        //Crear prodcuto
        const tempProduct = JSON.parse( JSON.stringify( new Product() ) );
        delete tempProduct._id;
        // tempProduct.images = ['img1.jpg', 'img2.jpg'];
        product = tempProduct;
    } else{
        product = await dbProducts.getProductBySlug(slug.toString());
    }

   

    if (!product) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }


    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage


