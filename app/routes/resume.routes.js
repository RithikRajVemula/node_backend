module.exports = (app) => {
    const resume = require("../controllers/resume.controller.js");
    var router = require("express").Router();
  
    // Create a new Resume
    router.post("/resumes/", resume.create);
  
    // Retrieve all Resumes (optionally add pagination or filters)
    router.get("/resumes/", resume.findAll);

    // Retrieve a single Resume with id
    router.get("/resumes/:id", resume.findOne);
    
    app.use("/", router);
  };
  