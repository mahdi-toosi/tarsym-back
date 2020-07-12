// eslint-disable-next-line no-unused-vars
const Docs = require('../services/documents/documents.class');

module.exports = function (app) {
    // Add your custom middleware here. Remember that
    // in Express, the order matters.

    // custom
    app.post('/create/documents/relationship', Docs.create_realationships);

    // Define tempalte engine
    app.set('view engine', 'pug');
    app.set('views', 'resources/views/');
    // general routes
    app.get('/', (req, res) => {
        try {
            res.render('home');
        } catch (error) {
            console.log(error);
        }
    });
};
