const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config");
const rjwt = require("restify-jwt-community"); //used for Routes protecting

const server = restify.createServer();

//https://www.youtube.com/watch?v=oyYOobBuczM

//Middleware
server.use(restify.plugins.bodyParser());

//Protect Routes
server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ["/auth"] }));
//this above will protect all the routes, except 'auth'.
//to add the token to the routes
//1. go to the GET customer route
//2. go to Headers
//3. go to /auth route and generate 'Token'
//4. copy ONLY token
//4. Add the below
// // Key: Authorization
// // VALUE: jwt + ' ' + token [add 'jwt and single space and copy token]
//Thats ALL.
//https://www.youtube.com/watch?v=oyYOobBuczM

server.listen(config.PORT, () => {
  mongoose
    .connect(config.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => {
      console.log("MongoDB connnected SUCCESSFULLY.");
    })
    .catch(() => {
      console.log("Error in connecting to MongoDB.");
    });
});

const db = mongoose.connection;

db.on("error", err => {
  console.log("Error while DB connection ON.");
});

db.once("open", () => {
  require("./routes/customers")(server);
  require("./routes/users")(server);
  console.log(`Server started on port ${config.PORT}`);
});
