const { Statistic } = require('../models/index');

class StatisticController {

    async getStatistics(req, res) {
        res.send(await Statistic.getStatistics(req.params.user_or_general, req.params.time));
    };

};


module.exports = new StatisticController();