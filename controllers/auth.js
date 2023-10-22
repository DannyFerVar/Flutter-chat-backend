const { response } = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid User'
            });
        }

        const user = new User(req.body);

        //crypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //generate JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact to the admin'
        });
    }

}

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {

        //Validate email
        const userDB = await User.findOne({ email });
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Invalid user'
            });
        }

        //Validate password
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid password'
            });
        }

        //Generate JWT
        const token = await generateJWT(userDB.id);
        res.json({
            ok: true,
            user: userDB,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the admin'
        });
    }

}

const renewToken = async (req, res = response) => {

    //const uid uid del usuario
    const uid = req.uid;

    //generar un nuevo JWT... uid...
    const token = await generateJWT(uid);

    //Obtener el usuario por UID. Usuaruio.findByID...
    const user = await User.findById(uid);

    res.json({
        ok: true,
        user,
        token
    });
}

module.exports = { createUser, login, renewToken }