module.exports = (sequelize, Sequelize) => {
  const Resume = sequelize.define("resume", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    generated_resume_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    linkedin_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    portfolio: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    professional_summary: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });

  return Resume;
};
