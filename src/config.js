const path = require("path");

module.exports = {
    host: "localhost",
    port: "3000",
    public: path.join(__dirname, "../public"),
    paginate: {
        default: 30,
        max: 50,
    },
    authentication: {
        entity: "user",
        service: "users",
        secret: "07GTOBkvmDWzNZS0HExP+Lv7Qf0=",
        authStrategies: ["jwt", "local"],
        jwtOptions: {
            header: {
                typ: "access",
            },
            audience: "http://localhost:8080",
            issuer: "feathers",
            algorithm: "HS256",
            expiresIn: "1d",
        },
        local: {
            usernameField: "username",
            passwordField: "password",
        },
        oauth: {
            redirect: "/",
            google: {
                key: "<google oauth key>",
                secret: "<google oauth secret>",
                scope: ["email", "profile", "openid"],
            },
        },
    },
    mongodb: "mongodb://localhost:27017/tarsymDB",
};