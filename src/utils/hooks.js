let newTags = [];

module.exports = {
    JSON_pars_data() {
        return context => {
            try {
                const json_data = JSON.parse(context.data.data);
                context.data = json_data;
                return context;
            } catch (error) {
                console.log(' \n JSON_pars_data => \n ', error);
            }
        };
    },
    get_new_tags() {
        return context => {
            let allTags = context.data.tags;
            if (!allTags) return context;

            // console.log('allTags => ', allTags);
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
            if (!newTags.length) return context;

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
            if (result.data) {
                result.data.forEach(doc => {
                    doc.tags.forEach(tag_id => {
                        tag_ids.add(String(tag_id));
                    });
                });
            } else {
                result.tags.forEach(tag_id => {
                    tag_ids.add(String(tag_id));
                });
            }
            const getTags = await app.service('tags').find({
                query: {
                    _id: {
                        $in: [...tag_ids],
                    },
                    $select: ['_id', 'name']
                }
            });
            try {
                if (result.data) {
                    result.data.forEach(doc => {
                        for (let index = 0; index < doc.tags.length; index++) {
                            const tag_ID = doc.tags[index];
                            const tag = getTags.data.filter(tag => String(tag._id) == String(tag_ID))[0];
                            doc.tags[index] = tag;
                        }
                    });
                } else {
                    for (let index = 0; index < result.tags.length; index++) {
                        const tag = getTags.data.filter(tag => String(tag._id) == String(result.tags[index]))[0];
                        result.tags[index] = tag;
                    }
                }
            } catch (error) {
                console.log('\n populate_tags => ', error);
            }
        };
    },
    remove_childs() {
        return async context => {
            const child_ids = context.result.childs_id;
            // TODO remove the doc if , the doc has no father
            if (!child_ids.length) return;
            try {
                const DocService = context.app.service('documents');
                child_ids.forEach(child_id => {
                    DocService.remove(child_id);
                });
            } catch (error) {
                console.log('\n remove_childs => ', error);
            }
        };
    },
    remove_useless_fields() {
        return async context => {
            const response = context.result,
                fields = ['title_fuzzy', 'excerpt_fuzzy', '__v', 'createdAt', 'updatedAt'];
            try {
                if (response.data) {
                    response.data.forEach(data => {
                        fields.forEach(field => {
                            delete data[field];
                        });
                    });
                } else {
                    fields.forEach(field => {
                        delete response[field];
                    });
                }
            } catch (error) {
                console.log('\n remove_useless_fields => ', error);
            }
        };
    }
};
