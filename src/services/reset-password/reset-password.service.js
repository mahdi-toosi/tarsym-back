// Initializes the `reset-password` service on path `/reset-password`
const { ResetPassword } = require("./reset-password.class");
const createModel = require("../../models/reset-password.model");
const hooks = require("./reset-password.hooks");

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: app.get("paginate"),
        multi: true,
    };

    // Initialize our service with any options it requires
    app.use("/reset-password", new ResetPassword(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service("reset-password");

    service.hooks(hooks);
};
