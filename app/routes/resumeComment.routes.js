module.exports = (app) => {
    const resumeComments = require("../controllers/resumeComment.controller.js");
    var router = require("express").Router();
    const { authenticateRoute,adminAuthenticateRoute } = require("../authentication/authentication");

    // Create a new ResumeComment
    router.post("/resumeComments/", [adminAuthenticateRoute], resumeComments.create);
  
    // Retrieve all ResumeComments
    router.get("/resumeComments/", [authenticateRoute], resumeComments.findAll);

    router.get("/resumeComments/resume/:resumeId", [authenticateRoute], resumeComments.getAllCommentsOnResume);

    // Retrieve a single ResumeComment with id
    router.get("/resumeComments/:id", [authenticateRoute], resumeComments.findOne);
  
    // Update a ResumeComment with id
    router.put("/resumeComments/:id", [adminAuthenticateRoute], resumeComments.update);
  
    // Delete a ResumeComment with id
    router.delete("/resumeComments/:id", [adminAuthenticateRoute], resumeComments.delete);
  
    // Delete all ResumeComments
    router.delete("/resumeComments/", [adminAuthenticateRoute], resumeComments.deleteAll);
  
    app.use("/", router);
  };
  