module.exports = {
    server: {
        port: 3007
    },
    redis: {},
    redisNotifer: {
        expired: true
    },
    prefixes: {
        messages: 'messages',
        show: 'expire'
    }
};