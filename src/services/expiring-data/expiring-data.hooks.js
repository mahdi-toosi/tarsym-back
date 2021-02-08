const { authenticate } = require("@feathersjs/authentication").hooks;

const { ValidRole, LimitQuery } = require("../../hooks/users");

const resetHooks = require("../../hooks/reset");

module.exports = {
    before: {
        all: [],
        find: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        get: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        create: [resetHooks.createCode],
        update: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        patch: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        remove: [
            LimitQuery(["$in", "$nin", "$ne", "$or"]),
            resetHooks.validate,
        ],
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [resetHooks.sendMsg],
        update: [],
        patch: [],
        remove: [resetHooks.reset],
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
