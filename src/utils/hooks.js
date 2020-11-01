module.exports = {
    JSON_pars_data() {
        return (context) => {
            try {
                const json_data = JSON.parse(context.data.data);
                context.data = json_data;
                return context;
            } catch (error) {
                console.log(" \n JSON_pars_data => \n ", error);
            }
        };
    },
    remove_childs() {
        return async (context) => {
            const child_ids = context.result.childs_id;
            // TODO remove the doc if , the doc has no father
            if (!child_ids.length) return context;
            try {
                const DocService = context.app.service("documents");
                for (let index = 0; index < child_ids.length; index++) {
                    const child_id = child_ids[index];
                    await DocService.remove(child_id, context.params);
                }
                return context;
            } catch (error) {
                console.log("\n remove_childs => ", error);
            }
        };
    },
    remove_useless_fields() {
        return async (context) => {
            const response = context.result,
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
                        fields.forEach(
                            (field_name) => delete data_field[field_name]
                        );
                    });
                } else {
                    fields.forEach((field_name) => delete response[field_name]);
                }
                return context;
            } catch (error) {
                console.log("\n remove_useless_fields => ", error);
            }
        };
    },
};
