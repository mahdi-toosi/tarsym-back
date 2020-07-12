let newTags = [];

module.exports = {
    JSON_pars_data() {
        return context => {
            try {
                const json_data = JSON.parse(context.data.data);
                context.data = json_data;
                return context;
            } catch (error) {
                console.log(' \n ###### document create hook log => => => \n ', error);
            }
        };
    },
    get_new_tags() {
        return context => {
            let allTags = context.data.tags;
            const get_new_tags = allTags.filter(el => el._id == undefined);
            get_new_tags.forEach(el => {
                newTags.push(el);
                const index = allTags.indexOf(el);
                allTags.splice(index, 1);
            });

            if (allTags.length == 0) return context;

            let valid_tags = [];
            allTags.forEach(el => {
                valid_tags.push(el._id);
            });
            allTags = valid_tags;

            return context;
        };
    },
    set_new_tags() {
        return context => {
            if (newTags.length == 0) return context;

            const doc_id = context.result._id;
            const TagsService = context.app.service('tags');
            const DocumentsService = context.app.service('documents');
            newTags.forEach(async el => {
                const obj = {
                    ...el,
                    documents: doc_id
                };
                const createdTag = await TagsService.create(obj);

                // const editDoc = 
                await DocumentsService.patch(doc_id, {
                    $push: {
                        tags: [createdTag._id]
                    }
                }, );
                // TODO => how can i pass updated tag filed to user ? look at next line ! doesnt work !
                // if (editDoc) context.result.tags.push(createdTag._id);
            });
            newTags = [];
            return context;
        };
    }
};
