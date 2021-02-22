// Application hooks that run for every service
const { GeneralError } = require("@feathersjs/errors");
const errorHandler = (ctx) => {
    if (!ctx.error) return ctx;
    if (process.env.NODE_ENV === "development") return ctx;

    const error = ctx.error;
    if (!error.code) {
        const newError = new GeneralError("server error");
        ctx.error = newError;
        return ctx;
    }
    if (error.code === 404 || process.env.NODE_ENV === "production") {
        error.stack = null;
    }
    return ctx;
};
module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    error: {
        all: [errorHandler],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
};
