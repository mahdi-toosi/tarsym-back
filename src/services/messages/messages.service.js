// Initializes the `messages` service on path `/messages`
const { Messages } = require("./messages.class");
const createModel = require("../../models/messages.model");
const hooks = require("./messages.hooks");

module.exports = function (app) {
    // * initial Msg types
    process.env["NormalMsg"] = 1;
    process.env["CopyMsg"] = 2;
    process.env["ShareMsg"] = 3;

    const options = {
        Model: createModel(app),
        paginate: {
            default: 10,
            max: 30,
        },
    };

    // Initialize our service with any options it requires
    app.use("/messages", new Messages(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service("messages");

    service.hooks(hooks);
};
