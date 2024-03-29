const {
    RoleBeforeCreate,
    RoleBeforeUpdate,
    ValidResultLength,
    ValidRole,
    protectData,
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
        remove: [authenticate("jwt"), ValidRole("AdminRole")],
    },

    after: {
        all: [protect("password"), protectData],
        find: [ValidResultLength],
        get: [],
        create: [
            async (ctx) => {
                await ctx.app
                    .service("expiring-data")
                    .create({ ...ctx.data, reason: "mobile verification" });
                return ctx;
            },
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
