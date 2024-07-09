module.exports = (sequelize, Sequelize) => {
  const Experience = sequelize.define("experience", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employer: {
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
    },
    position: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    information: {
      type: Sequelize.TEXT,
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

  return Experience;
};
