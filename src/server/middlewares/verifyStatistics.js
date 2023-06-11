const verifyStatistics = (req, res, next) => {

    if (!(req.params.user_or_general === "general" || Number.isInteger(parseInt(req.params.user_or_general)))) {
        return res.status(400).send({ err: "user_or_general debe ser un entero representando al peluquero o debe ser 'general'" });
    };

    if (!(Number.isInteger(parseInt(req.params.time)) || req.params.time === "monthly")) return res.status(400).send({ err: "time debe ser 'monthly' o un año válido" });

    next();
};

module.exports = verifyStatistics;