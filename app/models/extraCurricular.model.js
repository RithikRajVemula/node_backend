module.exports = (sequelize, Sequelize) => {
    const ExtraCurricular = sequelize.define("extraCurricular", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      heading: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      organization_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      information: {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    });
  
    return ExtraCurricular;
  };
  