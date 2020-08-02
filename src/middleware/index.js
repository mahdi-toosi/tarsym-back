// eslint-disable-next-line no-unused-vars
const Docs = require('../services/documents/documents.class');

module.exports = function (app) {
    // Add your custom middleware here. Remember that
    // in Express, the order matters.
    // custom api
    app.post('/create/documents/relationship', Docs.create_realationships);

    // Define tempalte engine
    // app.set('view engine', 'pug');
    // app.set('views', 'resources/views/');

    // general routes
    app.get('*', renderApp);

};

const path = require('path');
const renderApp = (req, res) => {
    try {
        // res.sendFile(path.join(__dirname + '../../../resources/views/index.html'));
        res.sendFile(path.join(__dirname + '../../../public/dist/index.html'));
    } catch (error) {
        console.log(error);
    }
};
