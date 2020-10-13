const logger = require("../logger");

exports.usersCheckRoleBeforeCreate = () => {
    return async (ctx) => {
        const dataRole = ctx.data.role;
        if (dataRole) throw new Error("You don't have permission");
        else return ctx;
    };
};

exports.usersCheckRoleBeforeUpdate = () => {
    return async (ctx) => {
        const user = ctx.params.user;
        if (user.role === process.env["URoleAdmin"]) return ctx;
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
};

exports.checkForValidRole = (validRole) => {
    return (ctx) => {
        const user_role = ctx.params.user.role;
        if (user_role <= validRole) throw new Error("You dont have permission");
        else return ctx;
    };
};
