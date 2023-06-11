import {createContext} from 'react';
import {io} from 'socket.io-client';
import { getRootPath } from '../functions/getRootPath';

const socket = io(`${getRootPath().replace("/api","")}`);

const socketContext = createContext(null);

export {socket,socketContext};