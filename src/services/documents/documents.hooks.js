// const {
//     authenticate
// } = require('@feathersjs/authentication').hooks;
const {
    // JSON_pars_data,
    get_new_tags,
    set_new_tags
} = require('../../utils/hooks');

module.exports = {
    before: {
        all: [
            // authenticate('jwt')
        ],
        find: [],
        get: [],
        create: [
            // JSON_pars_data(),
            get_new_tags()
        ],
        update: [
            // JSON_pars_data()
        ],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [
            set_new_tags()
        ],
        update: [],
        patch: [],
        remove: []
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
