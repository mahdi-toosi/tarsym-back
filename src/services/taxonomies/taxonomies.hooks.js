const { authenticate } = require("@feathersjs/authentication").hooks;

const { ValidRole } = require("../../hooks/users");

const {
    transferTheDocs_categories,
    transferTheDocs_tags,
} = require("../../utils/hooks");

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [authenticate("jwt"), ValidRole(process.env["URoleDrawer"])],
        update: [authenticate("jwt"), ValidRole(process.env["URoleDrawer"])],
        patch: [authenticate("jwt"), ValidRole(process.env["URoleDrawer"])],
        remove: [authenticate("jwt"), ValidRole(process.env["URoleDrawer"])],
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [transferTheDocs_categories(), transferTheDocs_tags()],
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
