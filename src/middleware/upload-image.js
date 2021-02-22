const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const logger = require("../logger");

const uploadPath = "public/UPLOADS";

// ! Store documents Images
const storeInDocuments = multer.diskStorage({
    destination: (req, file, cb) => cb(null, `${uploadPath}/documents`),
    filename: (req, file, cb) =>
        cb(null, `${Date.now()}.${file.originalname.split(".").slice(-1)[0]}`),
});

const storeDocImageWithMulter = multer({
    storage: storeInDocuments,
    limits: {
        fieldSize: 2e5, // Max field value size in bytes, here it's 200kb
        fileSize: 2e5, //  The max file size in bytes, here it's 200kb
    },
}).array("docImage");

const resToClientForDoc = (req, res) => {
    const destination = req.files[0].destination.replace(/public/g, "");
    res.status(201).send({ url: `${destination}/${req.files[0].filename}` });
};

// ! Store avatar Images
const storeAvatarWithMulter = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 2e5, // Max field value size in bytes, here it's 200kb
        fileSize: 2e5, //  The max file size in bytes, here it's 200kb
    },
}).array("avatar");

const resizeAvatarAndResponse = async (req, res, next) => {
    if (!req.files) return res.send("you did not send image");
    const newFilename = `${uploadPath}/avatars/${Date.now()}.jpeg`;

    await sharp(req.files[0].buffer)
        .resize(150, 150)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(newFilename);

    const url = newFilename.replace(/public/g, "");
    res.status(201).send({ url });
    req.body.avatarUrl = url;
    next();
};

const addAvatarToDatabase = async (req, res, next) => {
    const usersModel = req.app.service("users").Model;

    const user = await usersModel.findById(req.user._id);
    req.user.latestAvatar = user.avatar;

    const avatar = req.body.avatarUrl;
    await usersModel.findByIdAndUpdate(req.user._id, { avatar });

    next();
};

const removeAvatarFromFS = (req) => {
    const latestAvatar = req.user.latestAvatar;
    if (!latestAvatar) return;

    const avatarAdr = latestAvatar.split("/");
    const lastImageName = avatarAdr[avatarAdr.length - 1];
    const path = `${uploadPath}/avatars/${lastImageName}`;
    try {
        fs.unlinkSync(path);
    } catch (error) {
        logger.error(`removeAvatarFromFS  => ${error}`);
    }
};

module.exports = {
    storeDocImageWithMulter,
    resToClientForDoc,
    storeAvatarWithMulter,
    resizeAvatarAndResponse,
    removeAvatarFromFS,
    addAvatarToDatabase,
};
