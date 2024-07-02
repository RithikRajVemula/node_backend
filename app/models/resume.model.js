module.exports = (sequelize, Sequelize) => {
    const Resume = sequelize.define("resume", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      generated_resume_url: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  
    return Resume;
  };
  