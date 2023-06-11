import {useContext} from 'react';
import { authContext } from '../contexts/authContext.js';

const useAuth = () =>{

    const context = useContext(authContext);

    return [context.auth, context.setAuth];

};

export default useAuth;