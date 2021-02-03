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
        console.log("\n updateDatabase Error =>", error);
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
        console.log("\n setUsername Error =>", error);
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
        console.log("\n addManyData Error =>", error);
    }
};

module.exports = {
    setFlags,
    setUsername,
    addManyData,
};
