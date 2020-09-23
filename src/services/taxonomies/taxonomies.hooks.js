const {
    authenticate
} = require('@feathersjs/authentication').hooks;

const {
    checkForValidRole
} = require('../../hooks/check-role');

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [authenticate('jwt'), checkForValidRole(process.env['URoleDrawer'])],
        update: [authenticate('jwt'), checkForValidRole(process.env['URoleDrawer'])],
        patch: [authenticate('jwt'), checkForValidRole(process.env['URoleDrawer'])],
        remove: [authenticate('jwt'), checkForValidRole(process.env['URoleDrawer'])]
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
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
