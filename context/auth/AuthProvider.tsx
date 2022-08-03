import { createContext, FC, useReducer } from 'react';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';

export interface AuthState{
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

export const AuthProvider:FC<Props> = ({children}) => {

    const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE)

    return (
        <AuthContext.Provider value={{
            ...state,

            //Metodos

        }}>
            {children}
        </AuthContext.Provider>
    )
}