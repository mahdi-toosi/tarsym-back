const { authenticate } = require("@feathersjs/authentication").hooks;

const {
    // JSON_pars_data,
    remove_childs,
    remove_useless_fields,
} = require("../../hooks/documents");

const { ValidRole } = require("../../hooks/users");

module.exports = {
    before: {
        all: [authenticate("jwt")],
        find: [],
        get: [],
        create: [
            ValidRole(process.env["URoleDrawer"]),
            (ctx) => {
                const user = ctx.params.user;
                if (!ctx.data.user)
                    ctx.data.user = { _id: user._id, username: user.username };
                return ctx;
            },
        ],
        update: [
            ValidRole(process.env["URoleDrawer"]),
            (ctx) => {
                ctx.data.read = false;
                return ctx;
            },
        ],
        patch: [ValidRole(process.env["URoleDrawer"])],
        remove: [ValidRole(process.env["URoleDrawer"])],
    },

    after: {
        all: [remove_useless_fields()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [remove_childs()],
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
};
