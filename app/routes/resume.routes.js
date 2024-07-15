module.exports = (app) => {
  const resume = require("../controllers/resume.controller.js");
  var router = require("express").Router();

  // Create a new Resume
  router.post("/resumes/", resume.create);

  // Retrieve all Resumes (optionally add pagination or filters)
  router.get("/resumes/", resume.findAll);

  // Retrieve a Resume by user ID
  router.get("/resumes/user/:userId", resume.findByUserId);

  // Retrieve a single Resume with id
  router.get("/resumes/:id", resume.findOne);

  // Update a Resume with id
  router.put("/resumes/:id", resume.update);

  // Delete a Resume with id
  router.delete("/resumes/:id", resume.delete);

  // Delete all Resumes
  router.delete("/resumes/", resume.deleteAll);

  app.use("/", router);
};
