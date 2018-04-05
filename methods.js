const functions = require('./functions') || {};
const moment = require('moment');
const _ = require('lodash');

functions
    .getAwaitingMessages()
    .then(keys => _.map(keys, functions.showMessagesByKey))
    .catch(console.error);

module.exports = {
    'get /': (req, res) => res.send('pleace, use /echoAtTime route'),
    'get /echoAtTime': (req, res) => {
        if (!req.query.message || !req.query.time) return res.send('missing required params');
        const timeToLeft = functions.getTimeDiff(0, req.query.time),
            isNegativeTimeToLeft = (timeToLeft < 0);
        functions.addMessage(req.query.time, (!isNegativeTimeToLeft ? timeToLeft : 1), req.query.message.toString());
        return res.send('ok');
    }
};