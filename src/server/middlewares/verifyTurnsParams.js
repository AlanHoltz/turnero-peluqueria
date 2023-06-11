const verifyTurnsParams = (req, res, next) => {

    const restrictions = {
        turns_interval: "integer",
        same_turns_at_the_moment: ["manual", "auto"],
        turns_max_services: "integer",
        turns_max_days_difference_to_take: "integer",
    };

    const errors = {};

    const entries = Object.entries(req.query);

    if (!entries.length > 0) {
        res.status(400).send({ err: "Debes especificar al menos 1 parámetro" });
    };


    let i = 0;

    while (i < entries.length) {

        const param = entries[i];

        console.log(param[0]);

        if (restrictions[param[0]]) {
            if (restrictions[param[0]] === "integer") {
                errors[param[0]] = !Number.isInteger(+param[1])
            };
            if (Array.isArray(restrictions[param[0]])) {
                errors[param[0]] = !restrictions[param[0]].includes(param[1]);
            };
        } else {
            return res.status(400).send({ err: `${param[0]} no existe. Los parámetros permitidos son ${Object.keys(restrictions)}` })
        };

        i++;
    };


    if (Object.values(errors).some(val => val === true)) return res.send(errors);

    next();

};

module.exports = verifyTurnsParams;