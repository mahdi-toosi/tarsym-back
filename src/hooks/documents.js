const fs = require("fs");

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
        console.log("\n remove_useless_fields => ", error);
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

        if (paths.length) paths.forEach((path) => fs.unlinkSync(path));
    } catch (error) {
        console.log(error);
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
        console.log("\n remove_childs => ", error);
    }
};

module.exports = {
    remove_images_from_fs,
    remove_childs,
    remove_useless_fields,
};
