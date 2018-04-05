const _ = require('lodash');
const config = _.assign({
    redis: {},
    redisNotifer: {},
    prefixes: {}
}, require('./config'));
const redis = require("redis");
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const notifier = require('redis-notifier');
const redisClient = redis.createClient(config.redis);
const redisNotifer = new notifier(redis, _.assign(config.redisNotifer, {
    redis: config.redis
}));
const moment = require('moment');
const dataPredix = config.prefixes.messages || 'messages';
const expirePrefix = config.prefixes.expire || 'expire';

const redisSubscriber = function(pattern, channelPattern, emittedKey) {
    let channel = this.parseMessageChannel(channelPattern);
    console.log(emittedKey);
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
    },
    getAwaitingMessages: () => {
        const dataKey = `${dataPredix}_*`;
        const expireKey = `${expirePrefix}:*`;
        return Promise
            .all([
                redisClient.keysAsync(dataKey),
                redisClient.keysAsync(expireKey)
            ])
            .then(([awaitingMessages, expiredKeys]) => {
                expiredKeys = _.map(expiredKeys, key => _.get(key.split(':'), '1'))
                return _.map(_.difference(awaitingMessages, expiredKeys), key => `${expirePrefix}:${key}`);
            });
    },
    getTimeDiff: (time = 0, compareTime) => {
        time = parseInt(time);
        compareTime = parseInt(compareTime)
        if (!time)
            time = moment().unix();
        compareTime = moment.unix(compareTime).unix();
        return compareTime - time;
    }
};

redisNotifer.on('message', redisSubscriber);
module.exports = functions;