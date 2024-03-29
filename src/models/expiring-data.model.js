// expiringData-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = "expiringData";
    const mongooseClient = app.get("mongooseClient");
    const { Schema } = mongooseClient;
    const schema = new Schema({
        user_id: { type: String },
        username: {
            type: String,
            unique: true,
            dropDups: true,
            required: true,
        },
        mobile: {
            type: String,
            unique: true,
            dropDups: true,
            required: true,
        },
        reason: {
            type: String,
            required: true,
            // * can be
            //  reset password
            //  reset mobile
            //  mobile verification
        },
        code: { type: String, required: true },
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
