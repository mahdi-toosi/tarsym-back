const logger = require("../logger");

const RoleBeforeCreate = async (ctx) => {
    const dataRole = ctx.data.role;
    if (dataRole) throw new Error("You don't have permission");
    else return ctx;
};

const RoleBeforeUpdate = async (ctx) => {
    const user = ctx.params.user;
    if (user.role == process.env["AdminRole"]) return ctx;
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

const ValidRole = (validRole) => (ctx) => {
    const user_role = ctx.params.user.role;
    if (user_role <= validRole) throw new Error("You dont have permission");
    else return ctx;
};

const LimitQuery = (limitedQueries) => (ctx) => {
    const { query, user } = ctx.params;
    let hasLimitedQueries = false;

    // * check for limited queries
    for (const key in query) {
        if (limitedQueries.includes(key)) {
            hasLimitedQueries = true;
            break;
        }

        const element = query[key];
        if (typeof element !== "object") continue;

        for (const k in element) {
            if (!limitedQueries.includes(k)) continue;
            hasLimitedQueries = true;
            break;
        }
    }

    const isAdmin = user && user.role == process.env["AdminRole"];
    if (!hasLimitedQueries || isAdmin) return ctx;

    logger.error("Error 9568");
    throw new Error("Error 9568");
};

const ValidResultLength = (ctx) => {
    const lengthOfData = ctx.result.data.length;
    if (lengthOfData > 2) {
        const user_role = ctx.params.user.role;
        if (user_role == process.env["AdminRole"]) return ctx;
        else {
            // TODO => how to log user ip address ?!
            logger.error("someone try to get so many users ");
            throw new Error("Error");
        }
    }
};

module.exports = {
    RoleBeforeCreate,
    RoleBeforeUpdate,
    ValidRole,
    LimitQuery,
    ValidResultLength,
};
