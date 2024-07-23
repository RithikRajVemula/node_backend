module.exports = (app) => {
  const resume = require("../controllers/resume.controller.js");
  const { authenticateRoute,adminAuthenticateRoute } = require("../authentication/authentication");

  var router = require("express").Router();

  // Create a new Resume
  router.post("/resumes/", [authenticateRoute], resume.create);

  // Retrieve all Resumes (optionally add pagination or filters)
  router.get("/resumes/", [adminAuthenticateRoute], resume.findAll);

  // Retrieve a Resume by user ID
  router.get("/resumes/user/:userId", [authenticateRoute], resume.findByUserId);

  // Retrieve a single Resume with id
  router.get("/resumes/:id", [authenticateRoute], resume.findOne);

  // Update a Resume with id
  router.put("/resumes/:id", [authenticateRoute], resume.update);

  // Delete a Resume with id
  router.delete("/resumes/:id", [authenticateRoute], resume.delete);

  // Delete all Resumes
  router.delete("/resumes/", [adminAuthenticateRoute], resume.deleteAll);

  app.use("/", router);
};
