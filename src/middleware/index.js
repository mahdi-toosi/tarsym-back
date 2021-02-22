// eslint-disable-next-line no-unused-vars
const Docs = require("../services/documents/documents.class");
const path = require("path");
const { authenticate } = require("@feathersjs/express");
const UploadImage = require("./upload-image");
const blabla = require("./blabla");
const logger = require("../logger");

module.exports = function (app) {
    // Add your custom middleware here. Remember that
    // in Express, the order matters.
    // custom api

    app.get("/doc/*", (req, res) => {
        try {
            res.removeHeader("X-Frame-Options");
            res.sendFile(path.join(app.get("public"), "iframe/index.html"));
        } catch (error) {
            logger.error(`/doc/*  => ${error}`);
        }
    });

    app.post("/api/v1/iframe", Docs.sendIframeDoc);

    // blabla
    app.get("/setFlags", blabla.setFlags);
    app.get("/setUsername", blabla.setUsername);
    app.get("/addManyData", blabla.addManyData);
    app.get("/moveTooltipToText", blabla.moveTooltipToText);
    // end blabla

    app.post(
        "/administrator/copyDoc",
        authenticate("jwt"),
        Docs.copyDocForAdmin
    );

    app.post("/documents/create/relationship", Docs.create_relationships);
    app.post("/documents/remove/imgs", authenticate("jwt"), Docs.remove_imgs);

    app.get("/searchInDocs", Docs.search_in_docs); // TODO => is it need to check auth and role ?

    app.post(
        "/uploadDocImage",
        authenticate("jwt"),
        UploadImage.storeDocImageWithMulter,
        UploadImage.resToClientForDoc
    );
    app.post(
        "/uploadAvatarImage",
        authenticate("jwt"),
        UploadImage.storeAvatarWithMulter,
        UploadImage.resizeAvatarAndResponse,
        UploadImage.addAvatarToDatabase,
        UploadImage.removeAvatarFromFS
    );

    // Define template engine
    // app.set('view engine', 'pug');
    // app.set('views', 'resources/views/');

    // general routes
    app.get("/administrator/*", (req, res) => {
        try {
            res.sendFile(
                path.join(app.get("public"), "administrator/index.html")
            );
        } catch (error) {
            logger.error(`/administrator/*  => ${error}`);
        }
    });
    app.get("*", (req, res) => {
        try {
            res.sendFile(path.join(app.get("public"), "statics/index.html"));
        } catch (error) {
            logger.error(`*  => ${error}`);
        }
    });
};
