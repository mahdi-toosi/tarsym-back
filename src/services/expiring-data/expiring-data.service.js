// Initializes the `expiringData` service on path `/expiring-data`
const { ExpiringData } = require("./expiring-data.class");
const createModel = require("../../models/expiring-data.model");
const hooks = require("./expiring-data.hooks");

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: {
            default: 1,
            max: 2,
        },
        multi: true,
    };

    // Initialize our service with any options it requires
    app.use("/expiring-data", new ExpiringData(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service("expiring-data");

    service.hooks(hooks);
};
