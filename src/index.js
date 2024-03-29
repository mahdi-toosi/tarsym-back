const logger = require("./logger");
const app = require("./app");
const port = app.get("port");
const server = app.listen(port);
const host = app.get("host");

process.on("unhandledRejection", (reason, p) =>
    logger.error("Unhandled Rejection at: Promise ", p, reason)
);

const msg = `Application started on 
    => http${host == "localhost" ? "" : "s"}://${host}:${port} 
    => with ${process.env.NODE_ENV || "development"} mode`;

server.on("listening", () => logger.info(msg));
