const db = require("../models");
const ResumeComment = db.resumeComment;
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new ResumeComment
exports.create = (req, res) => {
  if (!req.body.comment || !req.body.resumeId || !req.body.userId) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const resumeComment = {
    comment: req.body.comment,
    resumeId: req.body.resumeId,
    userId: req.body.userId,
  };

  ResumeComment.create(resumeComment)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ResumeComment.",
      });
    });
};

// Retrieve all ResumeComments from the database.
exports.findAll = (req, res) => {
  ResumeComment.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving resume comments.",
      });
    });
};

// Find a single ResumeComment with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  ResumeComment.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find ResumeComment with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving ResumeComment with id=" + id,
      });
    });
};

// Update a ResumeComment by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  ResumeComment.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        ResumeComment.findByPk(id).then((data) => {
          res.send(data);
        });
      } else {
        res.send({
          message: `Cannot update ResumeComment with id=${id}. Maybe ResumeComment was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating ResumeComment with id=" + id,
      });
    });
};

// Delete a ResumeComment with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  ResumeComment.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "ResumeComment was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete ResumeComment with id=${id}. Maybe ResumeComment was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete ResumeComment with id=" + id,
      });
    });
};

// Delete all ResumeComments from the database.
exports.deleteAll = (req, res) => {
  ResumeComment.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} ResumeComments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all resume comments.",
      });
    });
};

exports.getAllCommentsOnResume = (req, res) => {
  const resumeId = req.params.resumeId;

  ResumeComment.findAll({
    where: { resumeId: resumeId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['first_name', 'last_name'] // Include the user's first and last name
    }],
    order: [['id', 'DESC']]
  })
    .then(comments => {
      res.send(comments);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving comments."
      });
    });
};