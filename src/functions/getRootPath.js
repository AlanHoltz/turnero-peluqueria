const getRootPath = (type = "server",showUrlIfItsInProduction = false) => {

    const serverIp = process.env.REACT_APP_SERVER_IP;
    const serverPort = process.env.REACT_APP_SERVER_PORT;
    const serverProtocol = process.env.REACT_APP_SERVER_PROTOCOL;
    const isInProduction = process.env.REACT_APP_PRODUCTION === "TRUE";
    const clientPort = process.env.REACT_APP_CLIENT_PORT;

    const params = {serverIp,serverPort,serverProtocol,isInProduction,clientPort};

    switch (type) {
        case "client":
            return getClientRootPath(params);
        case "server":
            return getServerRootPath(params, showUrlIfItsInProduction);
        default:
            break;
    }


};

const getClientRootPath = (params) => {
    return `${params.serverProtocol}://${params.serverIp}${!params.isInProduction ? `:${params.clientPort}` : "" }`;
    /*SI LA APP ESTÁ EN DEV AGREGA EL PUERTO PARA MANIPULAR LA URL DEL CLIENTE, SINO, SACA EL PUERTO*/
};

const getServerRootPath = (params, showUrlIfItsInProduction) => {

    const serverRoot = `${params.serverProtocol}://${params.serverIp}:${params.serverPort}/api`;

    if(showUrlIfItsInProduction){
        if(params.isInProduction){
            return serverRoot;
        }
    }

    if (params.isInProduction) return "/api";

    return serverRoot;
};

module.exports = {
    getRootPath
};