const verifyToken = require('../middlewares/verifyToken');
const verifyRegisterFields = require('../middlewares/verifyRegisterFields');
const verifyHairdresserPermission = require('./verifyHairdresserPermission');
const verifyParameters = require('./verifyParameters');
const verifyHairdressersActionsAllowed = require('./verifyHairdressersActionsAllowed');
const verifyPermissionHandling = require('./verifyPermissionHandling');
const verifyUserUpdateRequest = require('./verifyUserUpdateRequest');
const verifyScheduleFormat = require('./verifyScheduleFormat');
const verifyService = require('./verifyService');
const verifyFreeDay = require('./verifyFreeDay');
const verifyTurnsParams = require('./verifyTurnsParams');
const verifyTurn = require('./verifyTurn');
const verifyStatistics = require('./verifyStatistics');

module.exports = {
    verifyService,
    verifyToken,
    verifyRegisterFields,
    verifyHairdresserPermission,
    verifyPermissionHandling,
    verifyParameters,
    verifyHairdressersActionsAllowed,
    verifyUserUpdateRequest,
    verifyScheduleFormat,
    verifyFreeDay,
    verifyTurnsParams,
    verifyTurn,
    verifyStatistics,
};