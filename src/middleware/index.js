// eslint-disable-next-line no-unused-vars
const Docs = require('../services/documents/documents.class');
// const {
//     authenticate
// } = require('@feathersjs/express');

module.exports = function (app) {
    // Add your custom middleware here. Remember that
    // in Express, the order matters.
    // custom api
    app.post('/create/documents/relationship', Docs.create_realationships);

    // Define tempalte engine
    // app.set('view engine', 'pug');
    // app.set('views', 'resources/views/');

    // general routes
    app.get('/', renderApp);
    app.get('/create/doc/:id', renderApp);
    app.get('/update/doc/:id', renderApp);
    app.get('/my-docs', renderApp);
    app.get('/signup', renderApp);
    app.get('/login', renderApp);
};

const path = require('path');
const renderApp = (req, res) => {
    // const {
    //     user
    // } = req;
    // console.log('\n user #### => ', user);

    try {
        // console.log('\n req #### => ', req.feathers);
        // if (req.feathers.user) 
        res.sendFile(path.join(__dirname + '../../../resources/views/index.html'));
        // else res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
};

// function sendThisFile(file) {
//     return (req, res) => {
//         try {
//             res.sendFile(path.join(__dirname + `../../../resources/views/${file}.html`));
//         } catch (error) {
//             console.log(error);
//         }
//     };
// }
