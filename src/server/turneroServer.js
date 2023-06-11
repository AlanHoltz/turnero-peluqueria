const express = require('express');
const dotenv = require('dotenv');
const turnero = express();
const turneroServer = require('http').createServer(turnero);
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config({
    path: '../../.env'
});

const routes = require('./routes/index');

const { Server } = require('socket.io');
global.socket = new Server(turneroServer, {
    cors: {
        origin: "*"      /*SOCKET PARA COMUNICARSE BIDIRECCIONALMENTE CON EL FRONT END*/
    }
});


turnero.use(cors({
    credentials: true,
    /*MIENTRAS LA APP CORRA EN MODO DEV, SIRVE PARA QUE NO ARROJE EL ERROR DE CORS*/
    origin: true
}));

turnero.use(express.json());
turnero.use(cookieParser());
turnero.use("/api/users", routes.userRoute);
turnero.use("/api/turns", routes.turnRoute);
turnero.use("/api/services", routes.serviceRoute);
turnero.use("/api/free-days", routes.freeDayRoute);
turnero.use("/api/params", routes.paramRoute);
turnero.use("/api/statistics", routes.statisticRoute);
turnero.use("/media", express.static("media"));


turneroServer.listen(process.env.REACT_APP_SERVER_PORT, () => {

    console.clear();
    console.log(`SERVER IS RUNNING ON PORT ${process.env.REACT_APP_SERVER_PORT}`)
});