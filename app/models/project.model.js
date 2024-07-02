module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define("project", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      done_at: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      information: {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    });
  
    return Project;
  };
  