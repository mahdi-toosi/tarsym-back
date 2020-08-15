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
            const doc = list[i];
            await docService.patch(doc.new_id, {
                childs_id: [...doc.childs]
            }, );
        }
        res.status(201).send({
            message: 'realationships created'
        });
    } catch (error) {
        console.log('\n create_realationships => ', error);
    }
};

exports.search_in_docs = async (req, res) => {
    // console.log('\n req => ', req, '\n');
    const docService = req.app.service('documents'),
        text = req.params.text,
        forLayers = req.query.forLayers;
    let search = [];
    try {
        if (forLayers) {
            search = await docService.Model.fuzzySearch(text).select('_id title excerpt');
        } else {
            search = await docService.Model.fuzzySearch(text);
        }
        res.status(200).send(search);
    } catch (error) {
        console.log('\n search_in_docs => ', error);
    }
};
