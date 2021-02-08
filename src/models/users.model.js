// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
    const modelName = "users";
    const mongooseClient = app.get("mongooseClient");
    const schema = new mongooseClient.Schema(
        {
            name: { type: String, required: true },
            username: {
                type: String,
                lowercase: true,
                unique: true,
                dropDups: true,
            },
            avatar: { type: String },
            mobile: { type: String },
            mobileVerified: { type: Boolean, default: false },
            nationalCode: { type: String },
            job: { type: String },
            city: { type: String },
            password: { type: String, required: true },
            role: {
                type: Number,
                // * roles = {  // defined in users.service.js
                // *    admin: 48,
                // *    drawer: 35,
                // *    user: 3,
                // *    suspension: 1,
                // * }
                default: process.env["DrawerRole"],
            },
            // auth0Id: {
            //     type: String,
            // },
            // googleId: {
            //     type: String,
            // },
        },
        { timestamps: true }
    );

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);
};
