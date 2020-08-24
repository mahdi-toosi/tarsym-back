/* eslint-disable indent */
// documents-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'documents';
    const mongooseClient = app.get('mongooseClient');
    const {
        Schema
    } = mongooseClient;
    const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

    const schema = new Schema({
        title: {
            type: String,
            required: [true, 'به تیتر برای توضیح این مختصات نیاز است'],
        },
        excerpt: {
            type: String,
            required: [true, 'به متنی برای توضیح این مختصات نیاز است'],
            // maxlength: 800
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            },
        },
        zoom: {
            type: Number,
        },
        tags: [{
            type: Schema.Types.ObjectId,
            ref: 'taxonomies',
            // required: [true, 'برای سرچ بهتر کاربر ثبت حداقل یک تگ نیاز است'],
        }],
        categories: [{
            type: Schema.Types.ObjectId,
            ref: 'taxonomies',
        }],
        date: {
            type: Number,
            required: [true, 'برای سرچ بهتر کاربر ثبت تاریخ نیاز است'],
        },
        junk: {
            type: String,
            required: true
        },
        root: {
            type: Boolean,
        },
        childs_id: {
            type: Array,
        }
        // user: {
        //     id: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'User',
        //     },
        //     name: {
        //         type: String,
        //     },
        //     image: {
        //         type: String,
        //     },
        //     rol: {
        //         type: Number,
        //     },
        //     situation: {
        //         type: String,
        //     },
        // }
    }, {
        timestamps: true
    });

    schema.plugin(mongoose_fuzzy_searching, {
        fields: [{
                name: 'title',
                minSize: 4,
                weight: 5,
                prefixOnly: true,
            },
            {
                name: 'excerpt',
                minSize: 8,
                prefixOnly: true,
            }
        ]
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);

};
