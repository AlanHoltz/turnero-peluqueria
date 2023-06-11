const executeQuery = require('../utils/executeQuery');

class ServiceModel {

    getServices = async () => {
        const query = "SELECT * FROM services";
        const services = await executeQuery(query);
        return services;
    };

    getService = async (id) => {
        const query = "SELECT * FROM services WHERE service_id = ?";
        const parameters = [id];
        const service = await executeQuery(query, parameters);
        return service[0];
    };

    updateService = async ({ serviceID, serviceName, serviceEstimatedTime, serviceCost }) => {

        try {

            const query = `UPDATE services SET service_name = ?, service_estimated_time = ?, service_cost = ? 
            WHERE service_id = ?
            `;

            const parameters = [serviceName, serviceEstimatedTime, serviceCost, serviceID];

            return await executeQuery(query, parameters);
        }

        catch (err) {
            throw err;

        };



    };

    updateServicePhoto = async (id, photo) => {

        try {

            const query = "UPDATE services SET service_photo = ? WHERE service_id = ?";
            const parameters = [photo, id];

            return await executeQuery(query, parameters);

        }

        catch (err) {
            throw err;
        };


    };

    deleteService = async (id) => {
        try {

            const query = "DELETE FROM services WHERE service_id = ?";
            const parameters = [id];

            return await executeQuery(query, parameters);
        }

        catch (err) {
            throw err;
        };

    };

    createService = async ({ serviceName, serviceEstimatedTime, serviceCost }) => {

        try {

            const query = "INSERT INTO services (service_name,service_estimated_time,service_cost) VALUES (?,?,?)";
            const parameters = [serviceName, serviceEstimatedTime, serviceCost];

            return await executeQuery(query, parameters);;
        }

        catch (err) {
            throw err;
        };

    };



};

module.exports = new ServiceModel();