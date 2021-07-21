const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');

const UserSchema = Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    avatar: {
        type: String,
        trim: true
    },
    siteWeb: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function (next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
    next();
});

UserSchema.methods = {
    verifyPassword: (password, comparePassword) => {
        return bcrypt.compareSync(password, comparePassword);
    }
}

module.exports = model("User", UserSchema);