const users = require("./users/users.service.js");
const documents = require("./documents/documents.service.js");
const taxonomies = require("./taxonomies/taxonomies.service.js");
const resetPassword = require("./reset-password/reset-password.service.js");
const messages = require("./messages/messages.service.js");

module.exports = function (app) {
    app.configure(users);
    app.configure(documents);
    app.configure(taxonomies);
    app.configure(resetPassword);
    app.configure(messages);
};
