const {
    usersCheckRoleBeforeCreate,
    usersCheckRoleBeforeUpdate,
    checkForValidRole,
} = require("../../hooks/check-role");
const logger = require("../../logger");

const { authenticate } = require("@feathersjs/authentication").hooks;

const {
    hashPassword,
    protect,
} = require("@feathersjs/authentication-local").hooks;

module.exports = {
    before: {
        all: [],
        find: [authenticate("jwt")],
        get: [authenticate("jwt")],
        create: [usersCheckRoleBeforeCreate(), hashPassword("password")],
        update: [
            hashPassword("password"),
            authenticate("jwt"),
            usersCheckRoleBeforeUpdate(),
        ],
        patch: [
            hashPassword("password"),
            authenticate("jwt"),
            usersCheckRoleBeforeUpdate(),
        ],
        remove: [
            authenticate("jwt"),
            checkForValidRole(process.env["URoleAdmin"]),
        ],
    },

    after: {
        all: [
            // Make sure the password field is never sent to the client
            // Always must be the last hook
            protect("password"),
        ],
        find: [
            (ctx) => {
                const lengthOfData = ctx.result.data.length;
                if (lengthOfData > 2) {
                    const user_role = ctx.params.user.role;
                    if (user_role === process.env["URoleAdmin"]) return ctx;
                    else {
                        // TODO => how to log user ip address ?!
                        logger.error("someone try to get so many users ");
                        throw new Error("Error");
                    }
                }
            },
        ],
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
