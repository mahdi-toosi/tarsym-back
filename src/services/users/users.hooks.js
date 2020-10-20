const {
    RoleBeforeCreate,
    RoleBeforeUpdate,
    ValidResultLength,
    ValidRole,
    LimitQuery,
} = require("../../hooks/users");

const { SendWelcomeMsg } = require("../../hooks/messages");

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
        find: [authenticate("jwt"), LimitQuery()],
        get: [authenticate("jwt")],
        create: [RoleBeforeCreate(), hashPassword("password")],
        update: [
            hashPassword("password"),
            authenticate("jwt"),
            RoleBeforeUpdate(),
        ],
        patch: [
            hashPassword("password"),
            authenticate("jwt"),
            RoleBeforeUpdate(),
        ],
        remove: [authenticate("jwt"), ValidRole(process.env["URoleAdmin"])],
    },

    after: {
        all: [protect("passwords")],
        find: [ValidResultLength()],
        get: [],
        create: [
            (ctx) => {
                console.log(ctx.result);
                return ctx;
            },
            SendWelcomeMsg(),
        ],
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
