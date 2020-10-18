// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
exports.SendWelcomeMsg = () => (ctx) => {
    const newUser_id = ctx.result._id;
    const MsgsModel = ctx.app.service("messages").Model;
    const msg = {
        msg: "<p>ورود شما رو به ترسیم تبریک میگیم ...</p>",
        type: process.env["NormalMsg"],
        createdAt: new Date(),
    };
    const message = {
        members: ["admin", newUser_id],
        lastMsgFrom: "admin",
        title: "خوش اومدی به ترسیم",
        messages: [JSON.stringify(msg)],
    };
    MsgsModel.create(message);
    return ctx;
};
