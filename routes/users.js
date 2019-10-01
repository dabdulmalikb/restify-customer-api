const errors = require("restify-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../auth");
const config = require("../config");

module.exports = server => {
  //Register User
  //password: 12345
  server.post("/register", (req, res, next) => {
    const { email, password } = req.body;
    const user = new User({
      email,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        //Hash password
        user.password = hash;

        //save user now
        try {
          const newUser = await user.save();
          res.send(201, { status: "Success", message: "New user created" });
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  //Auth user
  server.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;
    try {
      //Authenticate user
      const user = await auth.authenticate(email, password);
      //Create JWT
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: "15m"
      });
      const { iat, exp } = jwt.decode(token);

      //Respond with Token
      res.send({ iat, exp, token });
      next();
    } catch (err) {
      //User unauthorized
      return next(new errors.UnauthorizedError(err));
    }
  });
};
