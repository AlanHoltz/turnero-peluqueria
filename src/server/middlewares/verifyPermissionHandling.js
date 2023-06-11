const verifyPermissionHandling = (req, res, next, fieldHasToBe) => {

    if(fieldHasToBe){
        if(!req.body.hairdresser_privilege_id){
            return res.status(400).send({error:"Debes especificar los privilegios para continuar(hairdresser_privilege_id)"});
        }
    }


    if (req.body.hairdresser_privilege_id) {
        if (req.decodedJwt.user_id === parseInt(req.params.id)) {

            res.status(403);
            return res.send({
                error: "No puedes cambiar tus propios privilegios"
            }); /*PRIMERO VERIFICO SI SE INTENTA CAMBIAR LOS PRIVILEGIOS*/
            /*PARA ESO EL USUARIO NO TIENE QUE SER EL MISMO Y TIENE*/
            /*QUE SER EL DUEÑO (hairdresser_privilege_id = 1)*/
        }
        if (req.decodedJwt.hairdresser_privilege_id !== 1) {

            res.status(403);
            return res.send({
                error: "Tiene que ser el dueño para cambiar los privilegios de otro peluquero"
            });

        };

        const privilege = req.body.hairdresser_privilege_id;

        if(privilege !== 2 && privilege !== 3){

            return res.status(400).send({error:"Solo puedes dar permisos de Administrador(2) o Peluquero(3)"});
        };



    };

    next();
};

module.exports = verifyPermissionHandling;