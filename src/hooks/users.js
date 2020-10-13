const logger = require("../logger");

exports.RoleBeforeCreate = () => async (ctx) => {
    const dataRole = ctx.data.role;
    if (dataRole) throw new Error("You don't have permission");
    else return ctx;
};

exports.RoleBeforeUpdate = () => async (ctx) => {
    const user = ctx.params.user;
    if (user.role == process.env["URoleAdmin"]) return ctx;
    if (!ctx.data._id) throw new Error("You don't have permission");
    if (ctx.data._id != user._id) {
        logger.error(
            `this user => ${user._id} , try to update this user => ${ctx.data._id}`
        );
        throw new Error("You don't have permission");
    }
    delete ctx.data.role;
    return ctx;
};

exports.ValidRole = (validRole) => (ctx) => {
    const user_role = ctx.params.user.role;
    if (user_role <= validRole) throw new Error("You dont have permission");
    else return ctx;
};

exports.LimitQuery = () => (ctx) => {
    if (ctx.params.query["$skip"]) {
        if (ctx.params.user.role == process.env["URoleAdmin"]) return ctx;
        logger.error("Error 9568");
        throw new Error("Error 9568");
    }
    return ctx;
};

exports.ValidResultLength = () => (ctx) => {
    const lengthOfData = ctx.result.data.length;
    if (lengthOfData > 2) {
        const user_role = ctx.params.user.role;
        if (user_role == process.env["URoleAdmin"]) return ctx;
        else {
            // TODO => how to log user ip address ?!
            logger.error("someone try to get so many users ");
            throw new Error("Error");
        }
    }
};
