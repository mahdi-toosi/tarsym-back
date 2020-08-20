let newTags = [];
let categorys_list = [];

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
            let Tags = context.data.tags;
            if (!Tags) return context;

            for (let index = 0; index < Tags.length; index++) {
                const tag = Tags[index];
                if (tag._id) continue;
                newTags.push(tag);
                Tags.splice(index, 1);
            }
            return context;
        };
    },
    set_new_tags() {
        return async context => {
            if (!newTags.length) return context;

            const doc_id = context.result._id;
            const TaxonomiesService = context.app.service('taxonomies');
            const DocumentsService = context.app.service('documents');
            try {
                let createdTag_ids = [];
                newTags.forEach(async tag => {
                    tag.documents = doc_id;
                    const createdTag = await TaxonomiesService.create(tag);
                    createdTag_ids.push(createdTag._id);
                });
                // TODO => how can i pass updated tag filed to user ? look at next line ! doesnt work !
                await DocumentsService.patch(doc_id, {
                    $push: {
                        tags: createdTag_ids
                    }
                }, );
                context.result.tags.concat(createdTag_ids);
                newTags = [];
                return context;
            } catch (error) {
                console.log('\n set_new_tags => ', error);
            }
        };
    },
    get_new_category() {
        return context => {
            const cats = context.data.categorys;
            if (!cats) return context;
            if (cats[cats.length - 1]._id) {
                context.data.categorys = [cats[cats.length - 1]._id];
                return context;
            }
            categorys_list = cats;
            delete context.data.categorys;
            return context;
        };
    },
    set_new_category() {
        return async context => {
            if (!categorys_list.length) return context;
            let cat_rels_list = [];
            const result = context.result,
                TaxonomiesService = context.app.service('taxonomies'),
                DocumentsService = context.app.service('documents');

            try {
                categorys_list.forEach(async category => {
                    if (category._id) {
                        cat_rels_list.push(category);
                        return;
                    }
                    category.documents = [result._id];
                    const newCat = await TaxonomiesService.create(category);
                    cat_rels_list.push(newCat);
                });

                // * update realationships
                for (let index = 0; index < cat_rels_list.length; index++) {
                    const cat = cat_rels_list[index];
                    const child_cat = cat_rels_list[index + 1];
                    if (!child_cat) break;
                    // if (!cat.childs) continue;
                    if (!cat.childs || cat.childs.includes(child_cat._id)) continue;
                    await TaxonomiesService.patch(cat._id, {
                        $push: {
                            childs: [child_cat._id],
                            documents: [result._id]
                        }
                    });
                }

                await DocumentsService.patch(result._id, {
                    categorys: [cat_rels_list[cat_rels_list.length - 1]._id]
                });

                result.categorys = [cat_rels_list[cat_rels_list.length - 1]._id];
                categorys_list = [];
                return context;
            } catch (error) {
                console.log('\n store_category => ', error);
            }
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
            const getTags = await app.service('taxanomy').find({
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
