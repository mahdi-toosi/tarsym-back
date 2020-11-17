const remove_childs = () => async (ctx) => {
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

const remove_useless_fields = () => async (ctx) => {
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

module.exports = { remove_useless_fields, remove_childs };
