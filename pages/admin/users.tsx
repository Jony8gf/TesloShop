import { PeopleOutline } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/layout'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { Chip, Grid, MenuItem, Select } from '@mui/material'
import useSWR from 'swr'
import { FullScreenLoading } from '../../components/ui'
import { IUser } from '../../interfaces'
import { tesloApi } from '../../api'
import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'

const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [ users, setUsers ] = useState<IUser[]>([]);
    const [ err, setErr ] = useState(false);

    useEffect(() => {
      if(data){
        setUsers(data);
      }
    }, [data])

    if( !data && !error) return <FullScreenLoading />

    const onRoleUpdate = async(userId: string, newRole: string) => {

        const previosUsers = users.map(user => ({...user}));
        const updateUsers = users.map(user=> ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updateUsers);
        setErr(false);

        try{
            await tesloApi.put('/admin/users', {userId, role: newRole});
        }catch(error){
            setUsers(previosUsers);
            setErr(true);
        }
    }

    const columns: GridColDef[] = [
        {field: 'email', headerName: 'Correo', width: 250},
        {field: 'name', headerName: 'Nombre', width: 250},
        {
            field: 'role', 
            headerName: 'Rol', 
            width: 250,
            renderCell: ({row}: GridValueGetterParams) => {
                return (
                    <Select
                        value={row.role}
                        label="Rol"
                        onChange={({target}) => onRoleUpdate(row.id, target.value)}
                        sx={{width: '300px'}}
                        >
                            <MenuItem value="admin">Admin</MenuItem>          
                            <MenuItem value="client">Client</MenuItem>
                    </Select>
                )
            }
        },
    ];

    const rows = users.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }));


  return (
    <AdminLayout title={'Listado de Usuarios'} subtitle={'Mantenimiento de usuarios'} icon={<PeopleOutline sx={{marginRight: 2}}/>}>
        <Grid container>
            <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                <DataGrid 
                    columns={columns} 
                    rows={rows} 
                    pageSize={10}
                    rowsPerPageOptions={[10,20,50]}
                />
            </Grid>
        </Grid>
        {
            err ?
            (
                <Chip 
                    color="error"
                    label="No se ha podido guardar el usuario" 
                    sx={{position: 'absolute', zIndex: 99, top: '10px', left: '10px'}}
                />
            ) : (<></>)
        }
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if ( !session ) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false
            }
        }
    }

    const validRoles = ['admin'];
    if(!validRoles.includes(session.user.role)){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default UsersPage