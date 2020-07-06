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
    const schema = new Schema({
        text: {
            type: String,
            required: [true, 'به متنی برای توضیح این مختصات نیاز است'],
            // maxlength: 800
        },
        point: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            },
        },
        // zoom: {
        //     type: Number,
        //     required: true
        // },
        tags: {
            type: [String],
            required: [true, 'برای سرچ بهتر کاربر ثبت حداقل یک تگ نیاز است'],
        },
        date: {
            type: Number,
            required: [true, 'برای سرچ بهتر کاربر ثبت تاریخ نیاز است'],
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

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);

};
