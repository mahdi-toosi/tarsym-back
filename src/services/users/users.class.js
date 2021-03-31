const { Service } = require("feathers-mongoose");

exports.Users = class Users extends Service {};

// exports.isThereUser = (req, res) => {
//     const username = req.query;
//     console.log(username);
//     res.status(200).send(username);
// };
