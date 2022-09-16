var createError = require("http-errors");
const http = require('http')
const jwt = require('jsonwebtoken')
const { ApolloServer, schemaDirectives } = require("apollo-server");
const secret = require('./config/secret')
// var express = require("express");
// var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
// var bodyParser = require("body-parser");
// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const directiveResolvers=require('./directives/isAuth')
const typeDefs = require("./controllers/schema");
const resolvers = require("./controllers/reslovers");
// var app = express();
//parse requests
// app.use(bodyParser.urlencoded({ extended: true }));

// // view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "pug");

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use('/users', usersRouter);
// app.use("/", require("./routes"));
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers,
  schemaDirectives,
});


const server = new ApolloServer({ 
  schema,
  context: ({req}) => {
    const token = req.headers.authorization || '';
    // console.log('token :>> ', token.split('Bearer ')[1]);
    const userData =  jwt.decode(token.split('Bearer ')[1], secret);
    // console.log('userData :>> ', userData);
    return { userData }
  }
});

server.listen().then(({ url }) => {
  console.log(`STARTED at ${url}`);
});
