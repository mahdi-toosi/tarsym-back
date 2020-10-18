const { Service } = require("feathers-mongoose");

exports.Messages = class Messages extends Service {};

exports.count_unread_msgs = async (req, res) => {
    const msgsModel = req.app.service("messages").Model;
    const user_id = req.query._id;
    try {
        const unreadMsgs = await msgsModel.countDocuments({
            members: user_id,
            lastMsgFrom: { $not: { $eq: user_id } },
        });
        res.status(200).send({
            unreadMsgs,
        });
    } catch (error) {
        console.log("\n count_unread_msgs => ", error);
        res.status(500);
    }
};
