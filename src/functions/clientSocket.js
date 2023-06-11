import {io} from 'socket.io-client';
import { getRootPath } from './getRootPath';

const socket = io(`${getRootPath().replace("/api","")}`);

export {socket};