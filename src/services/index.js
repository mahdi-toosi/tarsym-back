const users = require("./users/users.service.js");
const documents = require("./documents/documents.service.js");
const resetPassword = require("./reset-password/reset-password.service.js");

module.exports = function (app) {
    app.configure(users);
    app.configure(documents);
    app.configure(resetPassword);
};
