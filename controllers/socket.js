const User = require('../models/user');
const Message = require('../models/messages');

const connectedUser = async (uid = '') => {
    const user = await User.findById(uid);
    user.online = true;
    await user.save();
    return user;

}

const disconnectedUser = async (uid = '') => {
    const user = await User.findById(uid);
    user.online = false;
    await user.save();
    return user;

}

const saveMessage = async (payload) => {
    /*
        payload {
            from: '',
            to: '',
            text: ''
        }
    */

    try {
        const message = new Message(payload)
        await message.save();

        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    connectedUser,
    disconnectedUser,
    saveMessage
}