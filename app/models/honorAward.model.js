module.exports = (sequelize, Sequelize) => {
    const HonorAward = sequelize.define("honorAward", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
  
    return HonorAward;
  };
  