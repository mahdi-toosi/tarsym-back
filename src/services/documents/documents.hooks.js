const {
    authenticate
} = require('@feathersjs/authentication').hooks;
const {
    // JSON_pars_data,
    before_taxonomies_hook,
    set_new_tags,
    set_category,
    remove_childs,
    remove_useless_fields
} = require('../../utils/hooks');

module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [before_taxonomies_hook()],
        update: [before_taxonomies_hook()],
        patch: [before_taxonomies_hook()],
        remove: []
    },

    after: {
        all: [remove_useless_fields()],
        find: [],
        get: [],
        create: [set_new_tags(), set_category()],
        update: [set_new_tags(), set_category()],
        patch: [set_new_tags(), set_category()],
        remove: [remove_childs()]
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
