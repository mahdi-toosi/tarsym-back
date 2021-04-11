const bcrypt = require("bcryptjs");
const axios = require("axios");
const logger = require("../logger");

const createCode = async (ctx) => {
    const { username, reason } = ctx.data;
    const usersModel = ctx.app.service("users").Model;
    if (!username || !reason) throw new Error("username or reason not defined");

    // * find user if exist
    const user = await usersModel.findOne({ username }).exec();
    if (!user) {
        logger.error(
            `createCode => username not found , username => ${username}`
        );
        throw new Error("username not found");
    }
    // * create Code
    const code = String(Math.floor(100000 + Math.random() * 9000));

    ctx.data = {
        user_id: user._id,
        username: username,
        mobile: ctx.data.mobile || user.mobile,
        reason,
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
    let msg = "مسیج حاوی کد احراز هویت برای شما ارسال شد ...";
    let type = "info";
    // console.log({ mobile, code });
    await axios
        .get(
            `http://ippanel.com:8080/?apikey=${process.env.FARAZ_SMS_TOKEN}&pid=${process.env.FARAZ_PATTERN_CODE}&fnum=${process.env.FARAZ_NUMBER}&tnum=${mobile}&p1=code&v1=${code}`
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
const mobileVerification = async (ctx) => {
    return ctx;
};

const reset = async (ctx) => {
    const reason = ctx.result[0].reason;
    if (reason === "reset mobile") ctx = await resetMobile(ctx);
    else if (reason === "reset password") ctx = await resetPassAndAuth(ctx);
    else if (reason === "mobile verification")
        ctx = await mobileVerification(ctx);
    return ctx;
};

module.exports = {
    createCode,
    sendMsg,
    validate,
    reset,
};
