const bcrypt = require("bcryptjs");
const axios = require("axios");
const logger = require("../logger");

const createCode = async (ctx) => {
    // * find user if exist
    const usersModel = ctx.app.service("users").Model;
    const user = await usersModel
        .findOne({ username: ctx.data.username })
        .exec();
    if (!user) {
        logger.error(
            `createCode => username not found , username => ${ctx.data.username}`
        );
        throw new Error("username not found");
    }

    // * create Code
    const code = String(Math.floor(100000 + Math.random() * 9000));

    ctx.data = {
        user_id: user._id,
        username: user.username,
        mobile: ctx.data.mobile || user.mobile,
        resetMobile: ctx.data.mobile ? true : false,
        code,
    };
    return ctx;
};

const sendMsg = async (ctx) => {
    const { mobile, code } = ctx.result;
    if (!code) {
        logger.error("sendMsg => Server problem : generating code");
        throw new Error("Server problem : generating code");
    }
    let msg = "مسیج حاوی کد برای شما ارسال شد ...";
    let type = "info";
    // console.log({ mobile, code });
    await axios
        .post(
            "http://rest.ippanel.com/v1/messages/patterns/send",
            {
                originator: process.env.FARAZ_NUMBER,
                pattern_code: process.env.FARAZ_PATTERN_CODE,
                recipient: mobile,
                values: { code },
            },
            {
                headers: {
                    Authorization: `AccessKey ${process.env.FARAZ_SMS_TOKEN}`,
                },
            }
        )
        .then()
        .catch((error) => {
            logger.error(`sending sms  => ${error}`);
            msg =
                "مشکلی در ارسال مسیج بوجود آمده ... لطفا چند دقیقه بعد امتحان کنید ... ";
            type = "error";
        });

    // * empty res and send msg for user
    ctx.result = {};
    ctx.result = { type, msg };
    return ctx;
};

const validate = (ctx) => {
    const { username, code, mobile } = ctx.params.query;
    let valid = true;
    let doestHowNeededField = true;
    if (username) {
        if (username.length < 4) valid = false;
        doestHowNeededField = false;
    }
    if (mobile) {
        if (mobile.match(/^(\+98|0)?9\d{9}$/g)) valid = false;
        doestHowNeededField = false;
    }
    if (doestHowNeededField) valid = false;

    if (!code || code.length !== 6) valid = false;

    if (!valid) throw new Error("validation failed");

    return ctx;
};

const resetPassAndAuth = async (ctx) => {
    // console.log("generateNewPassAndAuth => ", ctx.result);
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

const resetMobile = async (ctx) => {
    const _id = ctx.result[0].user_id;
    const mobile = ctx.result[0].mobile;
    const Users = ctx.app.service("users").Model;
    const UserUpdated = await Users.findOneAndUpdate(
        _id,
        { mobile },
        { new: true }
    ).exec();
    // console.log({ UserUpdated });
    ctx.result = { newMobile: UserUpdated.mobile };
    return ctx;
};

const reset = async (ctx) => {
    if (ctx.result[0].resetMobile) ctx = await resetMobile(ctx);
    else ctx = await resetPassAndAuth(ctx);
    return ctx;
};

module.exports = {
    createCode,
    sendMsg,
    validate,
    reset,
};
