let newTags = [];
let categories_list = [];

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
    before_taxonomies_hook() {
        return context => {
            const Doc = context.data;
            if (!Doc.root) return context;

            // * handle tags
            let validTags = [];
            context.data.tags.forEach((tag) => {
                if (tag._id) return validTags.push(tag);
                newTags.push(tag);
            });
            context.data.tags = validTags;
            // * handle categories
            const Cats = context.data.categories;
            if (!Cats.length) return context;
            if (Cats[Cats.length - 1]._id) {
                context.data.categories = [Cats[Cats.length - 1]._id];
                return context;
            }
            categories_list = Cats;
            delete context.data.categories;

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
                for (let index = 0; index < newTags.length; index++) {
                    const tag = newTags[index];
                    tag.documents = [doc_id];
                    const createdTag = await TaxonomiesService.create(tag);
                    createdTag_ids.push(createdTag._id);
                }
                // TODO => how can i pass updated tag filed to user ? look at next line ! doesnt work !
                await DocumentsService.Model.findOneAndUpdate({
                    _id: doc_id
                }, {
                    $addToSet: {
                        tags: createdTag_ids
                    }
                }).exec();
                context.result.tags = context.result.tags.concat(createdTag_ids);
                newTags = [];
                return context;
            } catch (error) {
                console.log('\n set_new_tags => ', error);
            }
        };
    },
    set_category() {
        return async context => {
            if (!categories_list.length) return context;
            let cat_rels_list = [];
            const result = context.result,
                TaxonomiesService = context.app.service('taxonomies'),
                DocumentsService = context.app.service('documents');
            try {
                for (let index = 0; index < categories_list.length; index++) {
                    const category = categories_list[index];
                    if (category._id) {
                        cat_rels_list.push(category);
                        continue;
                    }
                    category.documents = [result._id];
                    const newCat = await TaxonomiesService.create(category);
                    cat_rels_list.push(newCat);
                }
                // * update realationships
                for (let index = 0; index < cat_rels_list.length; index++) {
                    const cat = cat_rels_list[index];
                    const child_cat = cat_rels_list[index + 1];
                    if (!child_cat) break;
                    if (!cat.childs || cat.childs.includes(child_cat._id)) continue;
                    await TaxonomiesService.patch(cat._id, {
                        $addToSet: {
                            childs: [child_cat._id],
                            documents: [result._id]
                        }
                    });
                }

                if (!cat_rels_list.length) {
                    categories_list = [];
                    return context;
                }
                const last_category_id = cat_rels_list[cat_rels_list.length - 1]._id;
                await DocumentsService.Model.findOneAndUpdate({
                    _id: result._id
                }, {
                    categories: last_category_id
                }).exec();
                result.categories = last_category_id;

                categories_list = [];
                return context;
            } catch (error) {
                console.log('\n store_category => ', error);
            }
        };
    },
    remove_childs() {
        return async context => {
            const child_ids = context.result.childs_id;
            // TODO remove the doc if , the doc has no father
            if (!child_ids.length) return context;
            try {
                const DocService = context.app.service('documents');
                child_ids.forEach(child_id => DocService.remove(child_id));
                return context;
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
                    response.data.forEach(data_field => {
                        fields.forEach(field_name => delete data_field[field_name]);
                    });
                } else {
                    fields.forEach(field_name => delete response[field_name]);
                }
            } catch (error) {
                console.log('\n remove_useless_fields => ', error);
            }
        };
    }
};
