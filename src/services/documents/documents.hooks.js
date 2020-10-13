const { authenticate } = require("@feathersjs/authentication").hooks;

const {
    // JSON_pars_data,
    before_taxonomies_hook,
    set_new_tags,
    set_category,
    remove_childs,
    remove_useless_fields,
} = require("../../utils/hooks");

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
                ctx.data.user = { id: user._id };
                return ctx;
            },
            before_taxonomies_hook(),
        ],
        update: [
            ValidRole(process.env["URoleDrawer"]),
            before_taxonomies_hook(),
        ],
        patch: [
            ValidRole(process.env["URoleDrawer"]),
            before_taxonomies_hook(),
        ],
        remove: [ValidRole(process.env["URoleDrawer"])],
    },

    after: {
        all: [remove_useless_fields()],
        find: [],
        get: [],
        create: [set_new_tags(), set_category()],
        update: [set_new_tags(), set_category()],
        patch: [set_new_tags(), set_category()],
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
