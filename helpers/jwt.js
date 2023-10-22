const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                //no se pudo crear el token
                reject('Could not create JWT');
            } else {
                //Token para mandar el usuario
                resolve(token);
            }
        })
    });

}

const tryJWT = (token = '') => {
    try {
        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        return [true, uid];
    } catch (error) {
        return [false, undefined];
    }
}

module.exports = { generateJWT, tryJWT }