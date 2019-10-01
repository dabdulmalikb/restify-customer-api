const errors = require("restify-errors");
const Customer = require("../models/Customer");

module.exports = server => {
  //Get ALL Customers
  server.get("/customers", async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });
  //Get single customer
  server.get("/customers/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const customer = await Customer.findById(id);
      res.send(200, { message: "SUCCESS", data: customer });
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with the id: ${id}`
        )
      );
    }
  });
  // Add Customer
  server.post("/customers", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects application/json"));
    }
    const { name, email, balance } = req.body;
    const customer = new Customer({
      name,
      email,
      balance
    });
    try {
      const newCustomer = await customer.save();
      res.send(201, { message: "SUCCESS", data: newCustomer });
      // res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  //Update Customer
  server.put("/customers/:id", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(
        new errors.InvalidContentError("Expects application/json format")
      );
    }

    try {
      const customer = await Customer.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );
      res.send(200, { message: "SUCCESS", data: customer });
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with the id: ${req.params.id}`
        )
      );
    }
  });

  //Delete customer
  server.del("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndRemove({ _id: req.params.id });
      res.send(204, { message: "Delete SUCCESS", data: customer });
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with the id: ${req.params.id}`
        )
      );
    }
  });
};
