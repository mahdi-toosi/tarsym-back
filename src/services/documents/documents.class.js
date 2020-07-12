const {
    Service
} = require('feathers-mongoose');

exports.Documents = class Documents extends Service {

};

exports.create_realationships = async (req, res) => {
    const docService = req.app.service('documents');
    const list = req.body;
    try {
        for (let i = 0; i < list.length; i++) {
            const el = list[i];
            await docService.patch(el.new_id, {
                childs_id: [...el.childs]
            }, );
        }
        res.status(201).send({
            message: 'realationships created'
        });
    } catch (error) {
        console.log(error);
    }
};
