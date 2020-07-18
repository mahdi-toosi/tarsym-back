// const {
//     authenticate
// } = require('@feathersjs/authentication').hooks;
const {
    // JSON_pars_data,
    get_new_tags,
    set_new_tags,
    populate_tags,
    remove_childs
} = require('../../utils/hooks');

module.exports = {
    before: {
        all: [
            // authenticate('jwt')
        ],
        find: [],
        get: [],
        create: [ // JSON_pars_data(),
            get_new_tags()
        ],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [populate_tags()],
        get: [populate_tags()],
        create: [set_new_tags()],
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
