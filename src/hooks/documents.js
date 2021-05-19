const fs = require("fs");
const logger = require("../logger");

const remove_useless_fields = async (ctx) => {
    const response = ctx.result,
        fields = [
            "title_fuzzy",
            "excerpt_fuzzy",
            "__v",
            "createdAt",
            // "updatedAt",
        ];
    try {
        if (response.data) {
            response.data.forEach((data_field) => {
                fields.forEach((field_name) => delete data_field[field_name]);
            });
        } else {
            fields.forEach((field_name) => delete response[field_name]);
        }
        return ctx;
    } catch (error) {
        logger.error(`remove_useless_fields => ${error}`);
    }
};

const remove_images_from_fs = (ctx) => {
    const description = JSON.parse(ctx.result.junk).description;
    try {
        const imgs = description.match(/<img [^>]*src="[^"]*"[^>]*>/gm);
        if (!imgs) return ctx;

        const paths = [];
        imgs.forEach((img) => {
            const addr = img.match(/UPLOADS\/documents\/.+(?=")/g);
            if (addr.length) paths.push(`public/${addr[0]}`);
        });

        if (paths.length)
            paths.forEach((path) => {
                try {
                    fs.unlinkSync(path);
                } catch (error) {
                    logger.error(
                        `remove_images_from_fs delete item => ${error}`
                    );
                }
            });
    } catch (error) {
        logger.error(`remove_images_from_fs  => ${error}`);
    }
    return ctx;
};

const remove_childs = async (ctx) => {
    const child_ids = ctx.result.childs_id;
    // TODO remove the doc if , the doc has no father
    if (!child_ids.length) return ctx;
    try {
        const DocService = ctx.app.service("documents");

        for (let index = 0; index < child_ids.length; index++) {
            const child_id = child_ids[index];
            await DocService.remove(child_id, ctx.params);
        }
        return ctx;
    } catch (error) {
        logger.error(`remove_childs  => ${error}`);
    }
};

async function updateChildrenSituations(children_ids, ctx) {
    const Docs = ctx.app.service("documents").Model;
    for (let index = 0; index < children_ids.length; index++) {
        const child_id = children_ids[index];
        const updatedDoc = await Docs.findOneAndUpdate(
            child_id,
            { situation: ctx.data.situation },
            { new: true }
        );
        if (!updatedDoc.childs_id.length) continue;
        await updateSituations(updatedDoc.childs_id, ctx);
    }
}

const updateSituations = async (ctx) => {
    if (!ctx.data.changeSituation) return ctx;
    const children_ids = ctx.result.childs_id;
    if (!children_ids.length) return ctx;
    await updateChildrenSituations(children_ids, ctx);
};

const countFathers = async (ctx) => {
    const doc_id = ctx.id;
    const DocsModel = ctx.app.service("documents").Model;
    const fathers = await DocsModel.find({
        childs_id: doc_id,
    }).countDocuments();

    if (fathers < 2) return ctx;

    throw new Error("documents has at least 2 fathers");
};

const setUser = (ctx) => {
    const user = ctx.params.user;
    if (!ctx.data.user)
        ctx.data.user = {
            _id: user._id,
            username: user.username,
            role: user.role,
        };
    return ctx;
};

module.exports = {
    remove_useless_fields,
    remove_images_from_fs,
    remove_childs,
    updateSituations,
    countFathers,
    setUser,
};
