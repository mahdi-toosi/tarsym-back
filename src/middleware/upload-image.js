const multer = require("multer");
// * config multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/UPLOADS/images"),
    //      -${file.originalname}
    filename: (req, file, cb) =>
        cb(null, `${Date.now()}.${file.originalname.split(".").slice(-1)[0]}`),
});
const upload = multer({
    storage,
    limits: {
        fieldSize: 2e7, // Max field value size in bytes, here it's 20MB
        fileSize: 2e6, //  The max file size in bytes, here it's 2MB
        // files: the number of files
        // READ MORE https://www.npmjs.com/package/multer#limits
    },
});

const storeWithMulter = () => {
    return upload.array("image");
};

const responseToClient = () => {
    return (req, res) => {
        res.status(201).send({
            url: `/UPLOADS/images/${req.files[0].filename}`,
        });
    };
};

module.exports = {
    storeWithMulter,
    responseToClient,
};
