// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

exports.usersCheckRoleBeforeCreate = () => {
    return async (context) => {
        if (context.data.role && context.data.role > process.env["URoleUser"])
            throw new Error("You dont have permission");
        else return context;
    };
};

exports.usersCheckRoleBeforeUpdate = () => {
    return async (context) => {
        const validRoleForChangeRole =
            context.params.user.role >= process.env["URoleAdmin"];
        if (!validRoleForChangeRole) delete context.data.role;
        return context;
    };
};

exports.checkForValidRole = (validRole) => {
    return (context) => {
        if (context.params.user.role <= validRole)
            throw new Error("You dont have permission");
        else return context;
    };
};
