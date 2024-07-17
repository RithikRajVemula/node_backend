module.exports = (app) => {
  const User = require("../controllers/user.controller.js");
  var router = require("express").Router();
  const { authenticateRoute,adminAuthenticateRoute } = require("../authentication/authentication");

  // Create a new User
  router.post("/users/", User.create);

  // Retrieve all Users
  router.get("/users/", [adminAuthenticateRoute], User.findAll);

  // Retrieve a single User with id
  router.get("/users/:id", [authenticateRoute], User.findOne);

  // Update a User with id
  router.put("/users/:id", [authenticateRoute], User.update);

  // Delete a User with id
  router.delete("/users/:id", [authenticateRoute], User.delete);

  // Delete all User
  router.delete("/users/", [adminAuthenticateRoute], User.deleteAll);

  app.use("/", router);
};
