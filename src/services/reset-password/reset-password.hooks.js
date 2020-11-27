const { authenticate } = require("@feathersjs/authentication").hooks;

const bcrypt = require("bcryptjs");

const { ValidRole } = require("../../hooks/users");

module.exports = {
    before: {
        all: [],
        find: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        get: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        create: [
            async (ctx) => {
                // * find user if exist
                const usersModel = ctx.app.service("users").Model;
                const user = await usersModel
                    .findOne({
                        username: ctx.data.username,
                    })
                    .exec();
                if (!user) throw new Error("username not found");
                // * create validation number
                const random_num = String(
                    Math.floor(100000 + Math.random() * 9000)
                );
                const Data = {
                    user_id: user._id,
                    username: user.username,
                    random_num,
                };
                ctx.data = Data;
                // TODO => send SMS
                console.log({
                    random_num,
                });
                return ctx;
            },
        ],
        update: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        patch: [authenticate("jwt"), ValidRole(process.env["AdminRole"])],
        remove: [
            (ctx) => {
                // * validate
                const { username, random_num } = ctx.params.query;
                const errors = [];
                if (username.length < 4) errors.push("username error");
                if (random_num.length !== 6) errors.push("code error");
                if (errors.length) throw new Error("validation failed");
                return ctx;
            },
        ],
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [
            (ctx) => {
                ctx.result = {};
                ctx.result.msg = "مسیج حاوی کد برای شما ارسال شد ...";
                return ctx;
            },
        ],
        update: [],
        patch: [],
        remove: [
            async (ctx) => {
                const _id = ctx.result[0].user_id;
                const Users = ctx.app.service("users").Model;
                // * create fake pass
                const password = String(
                    Math.floor(100000 + Math.random() * 9000)
                );
                // * hash pass with 10 digits
                // TODO => use this class -> https://docs.feathersjs.com/api/authentication/local.html#hashpassword-password
                const hash_password = await bcrypt.hash(password, 10);
                // * add fake password to user
                const UserUpdated = await Users.findOneAndUpdate(
                    { _id },
                    { password: hash_password },
                    { new: true }
                ).exec();
                // * create accessToken
                //  TODO => can i build accessToken without search in users ?
                const auth_data = await ctx.app
                    .service("/authentication")
                    .create({
                        strategy: "local",
                        username: UserUpdated.username,
                        password,
                    });
                // * send result without password
                delete auth_data.user.password;
                ctx.result = auth_data;
                return ctx;
            },
        ],
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
};
