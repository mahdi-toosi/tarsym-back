const bcrypt = require("bcryptjs");

const createCode = async (ctx) => {
    // * find user if exist
    const usersModel = ctx.app.service("users").Model;
    const user = await usersModel
        .findOne({
            username: ctx.data.username,
        })
        .exec();
    if (!user) throw new Error("username not found");

    // * create Code
    const code = String(Math.floor(100000 + Math.random() * 9000));

    ctx.data = {
        user_id: user._id,
        username: user.username,
        code,
    };
    return ctx;
};

const sendMsg = (ctx) => {
    // TODO => send SMS
    const code = ctx.result.code;
    if (!code) throw new Error("Server problem : generating code");
    console.log({ code });
    // * empty res and send msg for user
    ctx.result = {};
    ctx.result.msg = "مسیج حاوی کد برای شما ارسال شد ...";
    return ctx;
};

const validate = (ctx) => {
    const { username, code } = ctx.params.query;
    const errors = [];
    if (!username || username.length < 4) errors.push("username error");
    if (!code || code.length !== 6) errors.push("code error");
    if (errors.length) throw new Error("validation failed");
    return ctx;
};

const generateNewPassAndAuth = async (ctx) => {
    console.log("generateNewPassAndAuth => ", ctx.result);
    const _id = ctx.result[0].user_id;
    const Users = ctx.app.service("users").Model;
    // * create fake pass
    const password = String(Math.floor(100000 + Math.random() * 9000));
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
    const auth_data = await ctx.app.service("/authentication").create({
        strategy: "local",
        username: UserUpdated.username,
        password,
    });
    // * send result without password
    delete auth_data.user.password;
    ctx.result = auth_data;
    return ctx;
};

module.exports = {
    createCode,
    sendMsg,
    validate,
    generateNewPassAndAuth,
};
