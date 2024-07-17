module.exports = (app) => {
  const skills = require("../controllers/skill.controller.js");
  var router = require("express").Router();
  const { authenticateRoute,adminAuthenticateRoute } = require("../authentication/authentication");

  // Create a new Skill
  router.post("/skills/", [authenticateRoute], skills.create);

  // Retrieve all Skills
  router.get("/skills/", [authenticateRoute], skills.findAll);

  // Retrieve a single Skill with id
  router.get("/skills/:id", [authenticateRoute], skills.findOne);

  // Update a Skill with id
  router.put("/skills/:id", [adminAuthenticateRoute], skills.update);

  // Delete a Skill with id
  router.delete("/skills/:id", [adminAuthenticateRoute], skills.delete);

  // Delete all Skills
  router.delete("/skills/", [adminAuthenticateRoute], skills.deleteAll);

  app.use("/", router);
};
