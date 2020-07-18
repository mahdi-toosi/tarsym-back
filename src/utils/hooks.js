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
            const get_new_tags = allTags.filter(el => !el._id);
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
    },
    populate_tags() {
        return async context => {
            const {
                app,
                result
            } = context;
            let tag_ids = new Set();
            result.data.forEach(doc => {
                doc.tags.forEach(tag_id => {
                    tag_ids.add(String(tag_id));
                });
            });
            const getTags = await app.service('tags').find({
                query: {
                    _id: {
                        $in: [...tag_ids]
                    }
                }
            });

            try {
                for (let index = 0; index < result.data.length; index++) {
                    const doc = result.data[index];
                    for (let index = 0; index < doc.tags.length; index++) {
                        const tag_ID = doc.tags[index];
                        const tag = getTags.data.filter(tag => String(tag._id) == String(tag_ID))[0];
                        doc.tags[index] = tag;
                    }
                }
            } catch (error) {
                console.log(error);
            }
            // console.log(' \n  tag._id = > ', result.data, '\n');
            // allTags.forEach(tag => {
            // });
            // console.log(' \n result.data = > ', result.data, '\n');
        };
    },
    remove_childs() {
        return async context => {
            const child_ids = context.result.childs_id;
            if (!child_ids.length) return;
            const DocService = context.app.service('documents');
            child_ids.forEach(child_id => {
                DocService.remove(child_id);
            });
        };
    }
};
