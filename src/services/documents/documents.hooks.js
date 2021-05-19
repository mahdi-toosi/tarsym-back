const { authenticate } = require("@feathersjs/authentication").hooks;

const {
    // JSON_pars_data,
    remove_childs,
    remove_images_from_fs,
    remove_useless_fields,
    updateSituations,
    countFathers,
    setUser,
} = require("../../hooks/documents");

const { ValidRole } = require("../../hooks/users");

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [authenticate("jwt"), ValidRole("DrawerRole"), setUser],
        update: [
            authenticate("jwt"),
            ValidRole("DrawerRole"),
            (ctx) => {
                ctx.data.read = false;
                return ctx;
            },
        ],
        patch: [authenticate("jwt"), ValidRole("DrawerRole")],
        remove: [authenticate("jwt"), ValidRole("DrawerRole"), countFathers],
    },

    after: {
        all: [remove_useless_fields],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [updateSituations],
        remove: [remove_images_from_fs, remove_childs],
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
