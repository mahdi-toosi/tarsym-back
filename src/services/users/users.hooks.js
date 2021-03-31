const {
    RoleBeforeCreate,
    RoleBeforeUpdate,
    ValidResultLength,
    ValidRole,
} = require("../../hooks/users");

const { authenticate } = require("@feathersjs/authentication").hooks;

const {
    hashPassword,
    protect,
} = require("@feathersjs/authentication-local").hooks;

module.exports = {
    before: {
        all: [
            // (ctx) => {
            // * check for => is user request from browser ??
            //     if (
            //         ctx.params.headers.origin !=
            //         ctx.app.get("authentication").jwtOptions.audience
            //     ) {
            //         logger.error("Error 6585");
            //         throw new Error("Error 6585");
            //     }
            //     return ctx;
            // },
        ],
        find: [authenticate("jwt")],
        get: [authenticate("jwt")],
        create: [RoleBeforeCreate, hashPassword("password")],
        update: [
            hashPassword("password"),
            authenticate("jwt"),
            RoleBeforeUpdate,
        ],
        patch: [
            hashPassword("password"),
            authenticate("jwt"),
            RoleBeforeUpdate,
        ],
        remove: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
    },

    after: {
        all: [protect("password", "mobile", "nationalCode")],
        find: [ValidResultLength],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
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
