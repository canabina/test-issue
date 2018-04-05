const _ = require('lodash');
const config = _.assign({
    server: {}
}, require('./config'));
const express = require('express');
const app = express();
const serverPort = (config.server.port || 3000);
const methods = require('./methods') || {};

for (let method in methods) {
    let [methodType, route] = method.split(' ');
    if (!methodType || !route) throw `Invalid route param. (${method}) - invalid`;
    app[methodType](route, methods[method]);
}
app.listen(serverPort, () => console.log(`Run on ${serverPort} port`));