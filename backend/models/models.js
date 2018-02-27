import {digestPassword} from '../crypto';

let Sequelize = require('sequelize');

let url = process.env.DATABASE_URL || "sqlite:./../db/db.db";

let sequelize = new Sequelize(url);

let User = sequelize.define('user', {

    username: {
        type: Sequelize.STRING,
        unique: true,
        validate: {notEmpty: {msg: "Username must not be empty."}},
    },

    password: {
        type: Sequelize.STRING,
        validate: {notEmpty: {msg: "Password must not be empty."}},
        set(password) {
            this.setDataValue('password', digestPassword(password));
        },
    },

});

let New = sequelize.define('new', {

    // No author and date. It's created by default
    content: {
        type: Sequelize.STRING,
        validate: {notEmpty: {msg: "Content must not be empty."}},
    },

});

// Exporting authorId as foreingKey. Then, importing it with the same name.
// 'as' is just for getters and setters
New.belongsTo(User, {foreignKey: 'authorId'});
User.hasMany(New, {as: 'author', foreignKey: 'authorId'});

sequelize.sync()
    .then(() => {
        console.log("DB has been created");
    })
    .catch((err) => {
        console.log("Error while creating DB: ", err);
    });

exports.New = New;
exports.User = User;

exports.sequelize = sequelize;