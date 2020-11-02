// eslint-disable-next-line no-unused-vars
const Docs = require("../services/documents/documents.class");
const path = require("path");
const { authenticate } = require("@feathersjs/express");
const UploadImage = require("./upload-image");

module.exports = function (app) {
    // Add your custom middleware here. Remember that
    // in Express, the order matters.
    // custom api

    app.post("/create/documents/relationship", Docs.create_relationships);

    app.get("/searchInDocs", Docs.search_in_docs); // TODO => is it need to check auth and role ?

    app.post(
        "/upload-images",
        authenticate("jwt"),
        UploadImage.storeWithMulter(),
        UploadImage.responseToClient()
    );

    // Define tempalte engine
    // app.set('view engine', 'pug');
    // app.set('views', 'resources/views/');

    // general routes
    app.get("/administrator", (req, res) => {
        try {
            res.sendFile(
                path.join(app.get("public"), "administrator/index.html")
            );
        } catch (error) {
            console.log(error);
        }
    });
    app.get("*", (req, res) => {
        try {
            res.sendFile(path.join(app.get("public"), "statics/index.html"));
        } catch (error) {
            console.log(error);
        }
    });
};
