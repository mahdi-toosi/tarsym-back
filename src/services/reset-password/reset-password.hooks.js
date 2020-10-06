const {
    authenticate
} = require('@feathersjs/authentication').hooks;

const bcrypt = require('bcryptjs');

const {
    checkForValidRole
} = require('../../hooks/check-role');

module.exports = {
    before: {
        all: [],
        find: [authenticate('jwt'), checkForValidRole(process.env['URoleAdmin'])],
        get: [authenticate('jwt'), checkForValidRole(process.env['URoleAdmin'])],
        create: [
            async ctx => {
                // * find user if exist 
                const usersModel = ctx.app.service('users').Model;
                const user = await usersModel.findOne({
                    email: ctx.data.email
                }).exec();
                if (!user) throw new Error('email not found');
                // * create validation number
                const random_num = String(Math.floor(100000 + Math.random() * 9000));
                const Data = {
                    user_id: user._id,
                    user_email: user.email,
                    random_num
                };
                ctx.data = Data;
                // TODO => send SMS
                console.log({
                    random_num
                });
                return ctx;
            }
        ],
        update: [authenticate('jwt'), checkForValidRole(process.env['URoleAdmin'])],
        patch: [authenticate('jwt'), checkForValidRole(process.env['URoleAdmin'])],
        remove: [
            ctx => {
                // * validate
                const {
                    user_email,
                    random_num
                } = ctx.params.query;
                const errors = [];
                if (user_email.length < 4) errors.push('email error');
                if (random_num.length !== 6) errors.push('code error');
                if (errors.length) throw new Error('validation failed');
                return ctx;
            }
        ]
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [
            ctx => {
                ctx.result = {};
                ctx.result.msg = 'مسیج حاوی کد برای شما ارسال شد ...';
                return ctx;
            }
        ],
        update: [],
        patch: [],
        remove: [
            async ctx => {
                const _id = ctx.result[0].user_id;
                const Users = ctx.app.service('users').Model;
                // * create fake pass
                const password = String(Math.floor(100000 + Math.random() * 9000));
                // * hash pass with 10 digits
                // TODO => use this class -> https://docs.feathersjs.com/api/authentication/local.html#hashpassword-password
                const hash_password = await bcrypt.hash(password, 10);
                // * add fake password to user
                const UserUpdated = await Users.findOneAndUpdate({
                    _id
                }, {
                    password: hash_password
                }, {
                    new: true
                }).exec();
                // * create accessToken
                //  TODO => can i build accessToken without search in users ?
                const auth_data = await ctx.app.service('/authentication').create({
                    strategy: 'local',
                    email: UserUpdated.email,
                    password
                });
                // * send result without password
                delete auth_data.user.password;
                ctx.result = auth_data;
                return ctx;
            }
        ]
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};