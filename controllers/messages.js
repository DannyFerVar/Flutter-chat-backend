const Message = require('../models/messages');

const getChat = async (req, res) => {
    const myUid = req.uid;
    const messagesFrom = req.params.from;

    const last30 = await Message.find(
        { $or: [{ from: myUid, to: messagesFrom }, { from: messagesFrom, to: myUid }] }
    ).sort({ createdAt: 'desc' }).limit(30);

    res.json({
        ok: true,
        last30
    })

}

module.exports = { getChat }