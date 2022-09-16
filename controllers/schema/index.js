const { mergeTypeDefs } = require("@graphql-tools/merge");
const user = require("./user");
const event = require("./event");
const event_user = require("./event_user");

const types =[user,event,event_user]

module.exports = mergeTypeDefs(types);