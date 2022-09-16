const user = require("./user");
const event = require("./event");
const event_user = require("./event_user");


const { mergeResolvers } = require("@graphql-tools/merge");

module.exports = mergeResolvers([
    user,
    event,
    event_user,
]);
