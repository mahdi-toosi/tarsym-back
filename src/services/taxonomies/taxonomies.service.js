// Initializes the `taxonomies` service on path `/taxonomies`
const { Taxonomies } = require("./taxonomies.class");
const createModel = require("../../models/taxonomies.model");
const hooks = require("./taxonomies.hooks");

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: app.get("paginate"),
    };

    // Initialize our service with any options it requires
    app.use("/taxonomies", new Taxonomies(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service("taxonomies");

    service.hooks(hooks);
};
