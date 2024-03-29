const fs = require("fs");
const { Service } = require("feathers-mongoose");
const logger = require("../../logger");

exports.Documents = class Documents extends Service {};

exports.create_relationships = async (req, res) => {
    const docsModel = req.app.service("documents").Model;
    const list = req.body;
    try {
        for (let i = 0; i < list.length; i++) {
            const doc = list[i];
            await docsModel
                .findByIdAndUpdate(
                    { _id: doc.new_id },
                    { childs_id: doc.childs }
                )
                .exec();
        }
        res.status(201).send({
            message: "relationships created",
        });
    } catch (error) {
        logger.error(`create_relationships  => ${error}`);
    }
};

exports.copyDocForAdmin = async (req, res) => {
    // * check for valid Role
    if (req.user.role != process.env["AdminRole"]) {
        res.status(401).send("Error: Request failed with status code 401");
        return;
    }
    const docModel = req.app.service("documents").Model;
    const docs = [];
    try {
        // * get father
        const doc = await docModel.findById(req.body._id).exec();
        docs.push(doc._doc);

        // * get childs
        for (let index = 0; index < docs.length; index++) {
            const childs_id = docs[index].childs_id;
            for (let i = 0; i < childs_id.length; i++) {
                const child_id = childs_id[i];
                const doc = await docModel.findById(child_id).exec();
                if (!doc) continue;
                docs.push(doc._doc);
            }
        }

        // * clean docs
        docs.forEach((doc) => {
            if (doc.root) {
                doc.situation = "private";
                doc.vitrine = true;
                doc.read = false;
                doc.star = false;
                doc.copiedFrom = String(doc._id);
            }
            // * make fake ID
            doc.old_ID = String(doc._id);
            // * clean for new admin doc
            delete doc._id;
            delete doc.createdAt;
            delete doc.updatedAt;
        });
        // * create new docs
        for (let index = 0; index < docs.length; index++) {
            const doc = docs[index];
            const adminNewDoc = await docModel.create(doc);

            // * replace fake ID with new ID
            for (let index = 0; index < docs.length; index++) {
                const d = docs[index];
                const i = d.childs_id.indexOf(doc.old_ID);
                if (i === -1) continue;
                // console.log(d.childs_id[i], " => ", adminNewDoc._id);
                d.childs_id[i] = adminNewDoc._id;
            }
            doc._id = adminNewDoc._id;
        }

        // * get relationship list
        let list = [];
        docs.forEach((doc) => {
            if (!doc.childs_id.length) return;
            const obj = {
                new_id: doc._id,
                childs: doc.childs_id,
            };
            list.push(obj);
        });

        // * set relationship
        for (let index = 0; index < list.length; index++) {
            const doc = list[index];
            await docModel
                .findByIdAndUpdate(
                    { _id: doc.new_id },
                    { childs_id: doc.childs }
                )
                .exec();
        }

        res.status(201).send("copy created");
    } catch (error) {
        logger.error(`copyDocForAdmin  => ${error}`);
    }
};

exports.search_in_docs = async (req, res) => {
    const docModel = req.app.service("documents").Model,
        SearchedText = req.query.text,
        $skip = req.query.$skip || 0,
        forLayers = req.query.forLayers;
    let search = [],
        total;
    try {
        if (forLayers) {
            search = await docModel
                .fuzzySearch(SearchedText)
                .select("_id title excerpt")
                .limit(20)
                .exec();
            res.status(200).send({ data: search });
            return;
        }
        const Query = { root: true, vitrine: true, situation: "publish" };
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
                        type: "Polygon",
                        coordinates: [[...validArea]],
                    },
                },
            };
        }

        if (SearchedText) {
            search = await docModel
                .fuzzySearch(SearchedText, Query)
                .select(
                    "-createdAt -updatedAt -excerpt_fuzzy -title_fuzzy -__v"
                )
                .limit(20)
                .skip($skip)
                .exec();
            total = await docModel
                .fuzzySearch(SearchedText, Query)
                .select(
                    "-createdAt -updatedAt -excerpt_fuzzy -title_fuzzy -__v"
                )
                .countDocuments()
                .exec();
        } else {
            search = await docModel
                .find(Query)
                .select(
                    "-createdAt -updatedAt -excerpt_fuzzy -title_fuzzy -__v"
                )
                .limit(20)
                .skip($skip)
                .exec();
            total = await docModel
                .find(Query)
                .select(
                    "-createdAt -updatedAt -excerpt_fuzzy -title_fuzzy -__v"
                )
                .countDocuments()
                .exec();
        }

        res.status(200).send({ data: search, total });
    } catch (error) {
        if (error.codeName == "BadValue" && error.code == 2)
            res.status(415).send({
                error: "Mongo Error: area coordinates is not valid",
            });
        else logger.error(`search_in_docs  => ${error.codeName}`);
    }
};

exports.remove_imgs = async (req, res) => {
    const { images } = req.body;
    if (!images) {
        logger.error(`error on remove imgs , images => ${images}`);
        throw new Error("error on remove imgs");
    }
    images.forEach((img) => {
        const path = `${req.app.get("public")}/UPLOADS/documents/${img}`;
        try {
            fs.unlinkSync(path);
        } catch (error) {
            logger.error(`remove_imgs  => ${error.codeName}`);
        }
    });
    res.status(200).send("done");
};

exports.sendIframeDoc = async (req, res) => {
    const docsModel = req.app.service("documents").Model;
    const _ids = req.body.ids;
    let result;
    if (_ids.length === 1) {
        result = await docsModel
            .findOne({
                _id: _ids[0],
                situation: "publish",
                "user.role": { $gte: 37 },
            })
            .exec();
    } else {
        result = await docsModel
            .find({
                _id: _ids,
                situation: "publish",
                "user.role": { $gte: 37 },
            })
            .exec();
    }
    if (result) res.status(200).send(result);
    else res.status(404).send();
};

exports.taxonomies = async (req, res) => {
    const user_id = req.user._id;
    const docsModel = req.app.service("documents").Model;

    const tags = await docsModel
        .distinct("tags", { "user._id": user_id })
        .exec();
    const categories = await docsModel
        .distinct("categories", {
            "user._id": user_id,
        })
        .exec();
    res.status(200).send({ tags, categories });
};
