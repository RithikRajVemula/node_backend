module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define("session", {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expiration_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  return Session;
};
