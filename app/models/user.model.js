module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      unique: true,
    },
    password: {
      type: Sequelize.BLOB,
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
    is_admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    salt: {
      type: Sequelize.BLOB,
      allowNull: false,
    },
  });

  return User;
};

