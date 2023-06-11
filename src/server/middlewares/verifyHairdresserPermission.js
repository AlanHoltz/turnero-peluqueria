const verifyHairdresserPermission = (req, res, next, superAdminOnly = false, adminOnly = false) => {
    const {
        hairdresser_privilege_id
    } = req.decodedJwt;

    if (superAdminOnly) {
        if (hairdresser_privilege_id !== 1) return res.status(403).send({
            err: "Usted debe ser super administrador para ejecutar esta operación"
        });

    };

    if (adminOnly) {
        if (hairdresser_privilege_id > 2) return res.status(403).send({ err: "Usted debe ser al menos Administrador para ejecutar esta operación" });
    };

    if (hairdresser_privilege_id !== null) return next();

    return res.status(403).send({
        err: "Usted no posee los permisos de peluquero"
    });

};

module.exports = verifyHairdresserPermission;