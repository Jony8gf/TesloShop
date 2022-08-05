import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { createContext, FC, useEffect, useReducer } from 'react';
import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

const Auth_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

interface Props {
    children?: React.ReactNode | undefined,
}

export const AuthProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE)

    useEffect(() => {
      checkToken();    
    }, [])

    const checkToken = async() => {

        try {
            // const currentToken = Cookies.get('token');
            const { data } = await tesloApi.get('user/validate-token');
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
        } catch (error) {
            Cookies.remove('token');
        }
    }
    

    const loginUser = async (email: string, password: string): Promise<boolean> => {

        try {
            const { data } = await tesloApi.post('user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user })
            return true;

        } catch (error) {
            return false;
        }
    }

    const registerUser = async (name: string, email: string, password: string): Promise<{hasError: boolean; message?: string}>  =>  {

        try {
            const { data } = await tesloApi.post('user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user })
            return {
                hasError: false
            }

        } catch (err) {
            if (axios.isAxiosError(err)) {
                const error = err as AxiosError
                return {
                    hasError: true,
                    message: error.message
                };
            }
            return {
                hasError: true,
                message: "Error la registrarse. Intentelo de nuevo.",
            };
        }
    };


    return (
        <AuthContext.Provider value={{
            ...state,

            //Metodos
            loginUser,
            registerUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}