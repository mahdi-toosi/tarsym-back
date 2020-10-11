// reset-password-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = "resetPassword";
    const mongooseClient = app.get("mongooseClient");
    const { Schema } = mongooseClient;
    const schema = new Schema({
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        user_email: {
            type: String,
            unique: true,
        },
        random_num: {
            type: String,
        },
        expireAt: {
            type: Date,
            default: Date.now,
            index: {
                expires: "2m",
            },
        },
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);
};
