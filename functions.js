const _ = require('lodash');
const config = _.assign({
    redis: {},
    redisNotifer: {},
    prefixes: {}
}, require('./config'));
const redis = require("redis");
const notifier = require('redis-notifier');
const redisClient = redis.createClient(config.redis);
const redisNotifer = new notifier(redis, _.assign(config.redisNotifer, {
    redis: config.redis
}));
const dataPredix = config.prefixes.messages || 'messages';
const expirePrefix = config.prefixes.expire || 'expire';

const redisSubscriber = function(pattern, channelPattern, emittedKey) {
    let channel = this.parseMessageChannel(channelPattern);
    if (channel.key == 'expired')
        functions.showMessagesByKey(emittedKey);
};

const functions = {
    addMessage: (keyTime, expireTime, message) => {
        const dataKey = `${dataPredix}_${keyTime}`;
        const expireKey = `${expirePrefix}:${dataKey}`;
        redisClient.rpush(dataKey, message);
        redisClient.set(expireKey, '');
        redisClient.expire(expireKey, expireTime);
    },
    showMessagesByKey: key => {
        const [, dataKey] = key.split(':');
        return redisClient.lrange(dataKey, 0, -1, (err, list) => {
            if (err) return console.error(err);
            _.map(list, message => console.log(message));
            redisClient.del(dataKey);
        });
    }
};

redisNotifer.on('message', redisSubscriber);
module.exports = functions;