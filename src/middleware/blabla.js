const logger = require("../logger");

const setUserRoleInDocs = async (req, res) => {
    const docsModel = req.app.service("documents").Model;
    const usersModel = req.app.service("users").Model;
    const results = [];
    try {
        const docs = await docsModel.find({});
        for (let index = 0; index < docs.length; index++) {
            const doc = docs[index];
            const user = await usersModel.findById(doc.user._id);
            const result = await docsModel.findByIdAndUpdate(doc._id, {
                "user.role": user.role,
            });
            results.push(result);
        }

        res.status(200).send({ MatchedAndModified: results.length, results });
    } catch (error) {
        logger.error(`updateDatabase  => ${error}`);
    }
};

const setSituation = async (req, res) => {
    const docsModel = req.app.service("documents").Model;
    try {
        const result = await docsModel.updateMany({}, { situation: "publish" });
        res.status(200).send({
            Matched: result.n,
            Modified: result.nModified,
        });
    } catch (error) {
        logger.error(`updateDatabase  => ${error}`);
    }
};

const setFlags = async (req, res) => {
    const docsModel = req.app.service("documents").Model;
    try {
        const result = await docsModel.updateMany(
            { root: true },
            { situation: "publish", vitrine: false, star: false, read: false }
        );
        res.status(200).send({
            Matched: result.n,
            Modified: result.nModified,
        });
    } catch (error) {
        logger.error(`updateDatabase  => ${error}`);
    }
};

const setUsername = async (req, res) => {
    const docsModel = req.app.service("documents").Model;
    const usersModel = req.app.service("users").Model;
    try {
        const admin = await usersModel.findOne({
            username: req.query.username,
        });
        const result = await docsModel.updateMany(
            {
                // "user.username": { $exists: false }
            },
            { user: { _id: admin._id, username: admin.username } }
        );
        res.status(200).send({
            Matched: result.n,
            Modified: result.nModified,
        });
    } catch (error) {
        logger.error(`setUsername  => ${error}`);
    }
};

const addManyData = async (req, res) => {
    const docsModel = req.app.service("documents").Model;
    const usersModel = req.app.service("users").Model;
    try {
        const user = await usersModel.findOne({
            username: req.query.username,
        });
        for (let index = 0; index < 100; index++) {
            await docsModel.create({
                title: `موضوع داکیومنت ${index + 1}`,
                excerpt: "خلاصه فلان داکیومنت",
                tags: ["تگ 1", "تگ 2"],
                categories: ["دسته 1", "دسته 2"],
                date: 2647187,
                junk: "bla bla bla",
                root: true,
                childs_id: [],
                situation: "private",
                vitrine: false,
                star: false,
                read: false,
                user: { _id: user._id, username: user.username },
            });
        }

        res.status(200).send({ result: "100 داکیومن ساخته شد" });
    } catch (error) {
        logger.error(`addManyData  => ${error}`);
    }
};

const moveTooltipToText = async (req, res) => {
    const docsModel = req.app.service("documents").Model;
    const docs = await docsModel.find({});
    const results = [];
    try {
        for (let index = 0; index < docs.length; index++) {
            const doc = docs[index];
            const junk = JSON.parse(doc.junk);
            junk.tools.forEach((tool) => {
                const exTooltip = tool.tooltip;
                tool.tooltip = { text: exTooltip, image: null };
            });
            doc.junk = JSON.stringify(junk);
            const result = await docsModel.findByIdAndUpdate(doc._id, doc);
            results.push(result._id);
        }

        res.status(200).send({
            updatedDocsLength: results.length,
            updatedDocs: results,
        });
    } catch (error) {
        logger.error(`moveTooltipToText  => ${error}`);
    }
};

module.exports = {
    setFlags,
    setUsername,
    addManyData,
    moveTooltipToText,
    setSituation,
    setUserRoleInDocs,
};
