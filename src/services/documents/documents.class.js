const {
    Service
} = require('feathers-mongoose');

exports.Documents = class Documents extends Service {

};

exports.create_relationships = async (req, res) => {
    const docsModel = req.app.service('documents').Model;
    const list = req.body;
    try {
        for (let i = 0; i < list.length; i++) {
            const doc = list[i];
            await docsModel.findByIdAndUpdate({
                _id: doc.new_id
            }, {
                $addToSet: {
                    childs_id: [...doc.childs]
                }
            }).exec();
        }
        res.status(201).send({
            message: 'relationships created'
        });
    } catch (error) {
        console.log('\n create_relationships => ', error);
    }
};

exports.search_in_docs = async (req, res) => {
    const docModel = req.app.service('documents').Model,
        SearchedText = req.query.text,
        forLayers = req.query.forLayers;
    let search = [];
    try {
        if (forLayers) {
            search = await docModel.fuzzySearch(SearchedText).select('_id title excerpt').exec();
            res.status(200).send(search);
            return;
        }
        const Query = {};
        let area = req.query.area;
        if (area && area.length > 5) {
            let validArea = [];
            for (let index = 0; index < area.length; index += 2) {
                const coor = area[index];
                const Nextcoor = area[index + 1];
                const coordinates = [Number(coor), Number(Nextcoor)];
                validArea.push(coordinates);
            }
            validArea.push(validArea[0]);
            Query.location = {
                $geoWithin: {
                    $geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                ...validArea
                            ]
                        ]
                    }
                }
            };
        }

        if (SearchedText) search = await docModel.fuzzySearch(SearchedText, Query)
            .select('-createdAt -updatedAt -excerpt_fuzzy -title_fuzzy -__v')
            .exec();
        else search = await docModel.find(Query)
            .select('-createdAt -updatedAt -excerpt_fuzzy -title_fuzzy -__v')
            .exec();
        res.status(200).send(search);
    } catch (error) {
        if (error.codeName == 'BadValue' && error.code == 2)
            res.status(415).send({
                error: 'Mongo Error: area coordinates is not valid'
            });
        else console.log('\n search_in_docs => ', error.codeName);
    }
};
