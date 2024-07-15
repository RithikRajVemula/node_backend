module.exports = (app) => {
    const skills = require("../controllers/skill.controller.js");
    var router = require("express").Router();
  
    // Create a new Skill
    router.post("/skills/", skills.create);
  
    // Retrieve all Skills
    router.get("/skills/", skills.findAll);
  
    // Retrieve a single Skill with id
    router.get("/skills/:id", skills.findOne);
  
    // Update a Skill with id
    router.put("/skills/:id", skills.update);
  
    // Delete a Skill with id
    router.delete("/skills/:id", skills.delete);
  
    // Delete all Skills
    router.delete("/skills/", skills.deleteAll);
  
    app.use("/", router);
  };
  