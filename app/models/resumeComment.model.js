module.exports = (sequelize, Sequelize) => {
    const ResumeComment = sequelize.define("resumeComment", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      }
    });
  
    return ResumeComment;
  };
  