const users = require('./users/users.service.js');
const documents = require('./documents/documents.service.js');

module.exports = function (app) {
    app.configure(users);
    app.configure(documents);
};
