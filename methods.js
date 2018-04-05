const functions = require('./functions') || {};
const moment = require('moment');

module.exports = {
    'get /': (req, res) => res.send('pleace, use /echoAtTime route'),
    'get /echoAtTime': (req, res) => {
        if (!req.query.message || !req.query.time) return res.send('missing required params');
        const toExpireTime = moment.unix(parseInt(req.query.time)).unix(),
            currentTime = moment().unix(),
            timeToLeft = (toExpireTime - currentTime),
            isNegativeTimeToLeft = (difference < 0);
        functions.addMessage(toExpireTime, (!isNegativeTimeToLeft ? timeToLeft : 1), req.query.message.toString());
        return res.send('ok');
    }
};