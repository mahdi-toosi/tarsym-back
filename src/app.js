const path = require("path");
const favicon = require("serve-favicon");
const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./logger");
const feathers = require("@feathersjs/feathers");
require("dotenv").config();
const configuration = require("./config");
const express = require("@feathersjs/express");
const middleware = require("./middleware");
const services = require("./services");
const appHooks = require("./app.hooks");
const authentication = require("./authentication");
const mongoose = require("./mongoose");
const app = express(feathers());

//* Load app configuration
for (const key in configuration) {
    const val = configuration[key];
    app.set(key, val);
}

//* Enable security, CORS, compression, favicon, public folder and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use("/", express.static(app.get("public")));
app.use(favicon(path.join(app.get("public"), "statics/new-favicon.ico")));

//* log all requests
app.use(
    morgan("tiny", {
        stream: logger.stream,
    })
);

//* Set up Plugins and providers
app.configure(express.rest());
app.configure(mongoose);

//* Set up our services (see `services/index.js`)
app.configure(services);
app.configure(authentication);

//* Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.use(express.notFound());
app.use(express.errorHandler({ logger }));
app.hooks(appHooks);

module.exports = app;
