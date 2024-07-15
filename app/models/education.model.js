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
    from_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    to_date: {
      type: Sequelize.DATE,
      allowNull: true,
    }
  }, {
    hooks: {
      beforeCreate: (experience, options) => {
        if (!experience.to_date) {
          experience.to_date = null;
        }
      },
      beforeUpdate: (experience, options) => {
        if (!experience.to_date) {
          experience.to_date = null;
        }
      }
    }
    });

  return Education;
};
