const path = require('path');
const db = require("../models");
const Resume = db.resume;

exports.getPdf = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    const resume = await Resume.findByPk(resumeId);

    if (!resume || !resume.generated_resume_url) {
      return res.status(404).json({ message: 'Resume not found or PDF not generated.' });
    }

    const pdfPath = path.join(__dirname, '../../pdfs', resume.generated_resume_url);
    console.log("pdf path:",pdfPath);
    res.sendFile(pdfPath);
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).json({ message: 'Failed to fetch PDF.' });
  }
};

exports.downloadPdf = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    const resume = await Resume.findByPk(resumeId);

    if (!resume || !resume.generated_resume_url) {
      return res.status(404).json({ message: 'Resume not found or PDF not generated.' });
    }

    const pdfPath = path.join(__dirname, '../../pdfs', resume.generated_resume_url);
    console.log("d pdf path:",pdfPath);
    res.download(pdfPath, `${resume.first_name}_${resume.last_name}_Resume.pdf`);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    res.status(500).json({ message: 'Failed to download PDF.' });
  }
};
