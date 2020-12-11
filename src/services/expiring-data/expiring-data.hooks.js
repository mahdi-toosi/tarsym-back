const { authenticate } = require("@feathersjs/authentication").hooks;

const { ValidRole, LimitQuery } = require("../../hooks/users");

const resetPass = require("../../hooks/reset-password");

module.exports = {
    before: {
        all: [],
        find: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        get: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        create: [resetPass.createCode],
        update: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        patch: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        remove: [LimitQuery(["$in", "$nin", "$ne", "$or"]), resetPass.validate],
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [resetPass.sendMsg],
        update: [],
        patch: [],
        remove: [resetPass.generateNewPassAndAuth],
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
