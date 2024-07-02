module.exports = (sequelize, Sequelize) => {
    const Education = sequelize.define("education", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      university_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      course: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      specialization: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gpa: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      from_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      to_date: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });
  
    return Education;
  };
  