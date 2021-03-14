/* eslint-disable indent */
// documents-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = "documents";
    const mongooseClient = app.get("mongooseClient");
    const { Schema } = mongooseClient;
    const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

    const schema = new Schema(
        {
            title: { type: String },
            excerpt: { type: String },
            tags: [String],
            categories: [String],
            date: { type: Date },
            junk: { type: String },
            root: { type: Boolean },
            childs_id: { type: Array },
            situation: {
                type: String,
                // *** situation levels
                // * publish
                // * private
                // * trash
                // * draft
            },
            vitrine: { type: Boolean },
            copiedFrom: { type: String },
            star: { type: Boolean },
            read: { type: Boolean },
            user: {
                _id: String,
                username: { type: String },
                role: { type: Number, default: 35 },
            },
        },
        { timestamps: true }
    );

    schema.plugin(mongoose_fuzzy_searching, {
        fields: [
            {
                name: "title",
                minSize: 4,
                weight: 5,
                prefixOnly: true,
            },
            // {
            //     name: "excerpt",
            //     minSize: 8,
            //     weight: 10,
            //     prefixOnly: true,
            // },
        ],
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);
};
