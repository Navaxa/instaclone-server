const User = require("../models/user");
const jwt = require('jsonwebtoken');
const azureUploadImage = require('../utils/azure-upload-image');
const path = require('path');
const { createWriteStream } = require("fs");
const fs = require('fs');

const createToken = (user, SECRET_KEY, expiresIn) => {
    const { id, name, username, email } = user;
    const payload = {
        id,
        name,
        username,
        email
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

const register = async (input) => {
    const newUser = input;
    newUser.email = newUser.email.toLowerCase();
    newUser.username = newUser.username.toLowerCase();

    const { email, username } = newUser;
    const foundEmail = await User.findOne({ email });

    if (foundEmail) return 'El email ya esta en uso';

    const foundUsername = await User.findOne({ username });

    if (foundUsername) return 'El nombre de usuario ya esta en uso';

    try {

        const user = User.create(newUser);
        return user;

    } catch (err) {
        console.log('Error => ', err);
    }
    return input;
}

const login = async (input) => {
    const { email, password } = input;

    const userFound = await User.findOne({ email: email.toLowerCase() });

    if (!userFound) {
        throw new Error('Las credenciales no coinciden');
    }

    if (!userFound.verifyPassword(password, userFound.password)) {
        throw new Error('Las credenciales no coinciden');
    }

    return {
        token: createToken(userFound, process.env.SECRET_KEY, '1h')
    }
}

const getUser = async (id, username) => {
    let user = null;

    if (id) user = await User.findById(id);
    if (username) user = await User.findOne({ username });

    if (!user) throw new Error('El usuario no existe');

    return user;
}

const updateAvatar = async (file, ctx) => {
    const { id } = ctx;
    const { createReadStream, mimetype } = await file;
    const extension = mimetype.split('/')[1];
    const imageName = `${id}.${extension}`;

    try {
        await new Promise(res => {
            createReadStream()
                .pipe(createWriteStream(path.join(__dirname, '../images', imageName)))
                .on("close", res);
        });
        const filePath = path.join(__dirname, '../images', imageName);
        const url = await azureUploadImage(filePath, mimetype, imageName);
        // await User.findByIdAndUpdate(id, {avatar: url});
        fs.unlinkSync(filePath);
        await User.findByIdAndUpdate(id, {avatar: url});
        return {
            status: true,
            urlAvatar: url
        }
    } catch(err) {
        console.log('error => ', err);
        return {
            status: false,
            urlAvatar: null
        }
    }
}

const deleteAvatar = async (ctx) => {
    const {id} = ctx;
    try {
        await User.findByIdAndUpdate(id, {avatar: ""});
        return true;
    } catch(err) {
        console.log('Error => ', err);
        return false;
    }
}

module.exports = {
    register,
    login,
    getUser,
    updateAvatar,
    deleteAvatar
}