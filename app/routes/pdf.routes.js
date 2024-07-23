module.exports = (app) => {
    const pdf = require("../controllers/pdf.controller.js");
    var router = require("express").Router();
    const { authenticateRoute } = require("../authentication/authentication");

    router.get("/view-pdf/:resumeId", [authenticateRoute], pdf.getPdf);
    router.get("/download-pdf/:resumeId", [authenticateRoute], pdf.downloadPdf);
  
    app.use("/", router);
  };
  