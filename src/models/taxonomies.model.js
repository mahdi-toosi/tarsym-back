// taxonomies-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = "taxonomies";
    const mongooseClient = app.get("mongooseClient");
    const { Schema } = mongooseClient;
    const schema = new Schema({
        name: { type: String, required: true, unique: true },
        //*    categories type = 1 / tags type = 2
        type: { type: Number, required: true },
        childs: { type: [String] },
        documents: [
            {
                type: Schema.Types.ObjectId,
                ref: "documents",
            },
        ],
    });
    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);
};
