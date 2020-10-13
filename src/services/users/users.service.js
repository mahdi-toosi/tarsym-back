// Initializes the `users` service on path `/users`
const { Users } = require("./users.class");
const createModel = require("../../models/users.model");
const hooks = require("./users.hooks");

module.exports = function (app) {
    // * initial user roles
    process.env["URoleAdmin"] = 48;
    process.env["URoleDrawer"] = 35;
    process.env["URoleUser"] = 3;
    process.env["URoleSuspension"] = 1;

    const options = {
        Model: createModel(app),
        paginate: {
            default: 1,
            max: 20,
        },
    };

    // Initialize our service with any options it requires
    app.use("/users", new Users(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service("users");

    service.hooks(hooks);
};
