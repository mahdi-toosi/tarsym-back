const { authenticate } = require("@feathersjs/authentication").hooks;

const {
    // JSON_pars_data,
    remove_childs,
    remove_images_from_fs,
    remove_useless_fields,
} = require("../../hooks/documents");

const { ValidRole } = require("../../hooks/users");

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [
            authenticate("jwt"),
            ValidRole(process.env["DrawerRole"]),
            (ctx) => {
                const user = ctx.params.user;
                if (!ctx.data.user)
                    ctx.data.user = {
                        _id: user._id,
                        username: user.username,
                        role: user.role,
                    };
                return ctx;
            },
        ],
        update: [
            authenticate("jwt"),
            ValidRole(process.env["DrawerRole"]),
            (ctx) => {
                ctx.data.read = false;
                return ctx;
            },
        ],
        patch: [authenticate("jwt"), ValidRole(process.env["DrawerRole"])],
        remove: [
            authenticate("jwt"),
            ValidRole(process.env["DrawerRole"]),
            async (ctx) => {
                const doc_id = ctx.id;
                const DocsModel = ctx.app.service("documents").Model;
                const fathers = await DocsModel.find({
                    childs_id: doc_id,
                }).countDocuments();

                if (fathers < 2) return ctx;

                throw new Error("documents has at least 2 fathers");
            },
        ],
    },

    after: {
        all: [remove_useless_fields],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
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
