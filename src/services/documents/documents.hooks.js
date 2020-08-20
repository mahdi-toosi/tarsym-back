const {
    authenticate
} = require('@feathersjs/authentication').hooks;
const {
    // JSON_pars_data,
    get_new_tags,
    set_new_tags,
    get_new_category,
    set_new_category,
    // populate_tags,
    remove_childs,
    remove_useless_fields
} = require('../../utils/hooks');

module.exports = {
    before: {
        all: [
            authenticate('jwt')
        ],
        find: [],
        get: [],
        create: [ // JSON_pars_data(),
            get_new_tags(), get_new_category()
        ],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [remove_useless_fields()],
        find: [
            // populate_tags()
        ],
        get: [
            // populate_tags()
        ],
        create: [set_new_tags(), set_new_category()],
        update: [],
        patch: [],
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
