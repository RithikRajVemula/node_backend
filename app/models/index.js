const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  define: {
    timestamps: false
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.session = require("./session.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.resume = require("./resume.model.js")(sequelize, Sequelize);
db.skill = require("./skill.model.js")(sequelize, Sequelize);
db.resumeSkill = require("./resumeSkill.model.js")(sequelize, Sequelize);
db.resumeComment = require("./resumeComment.model.js")(sequelize, Sequelize);
db.experience = require("./experience.model.js")(sequelize, Sequelize);
db.education = require("./education.model.js")(sequelize, Sequelize);
db.extraCurricular = require("./extraCurricular.model.js")(sequelize, Sequelize);
db.honorAward = require("./honorAward.model.js")(sequelize, Sequelize);
db.project = require("./project.model.js")(sequelize, Sequelize);

// foreign key for session
db.user.hasMany(db.session,{ as: "session" },{ foreignKey: { allowNull: false }, onDelete: "CASCADE" });
db.session.belongsTo(db.user,{ as: "user" },{ foreignKey: { allowNull: false }, onDelete: "CASCADE" });

db.user.hasMany(db.resume,{ as: "resumes" }, { foreignKey: "user_id" });
db.resume.belongsTo(db.user,{ as: "user" }, { foreignKey: "user_id" });

db.resume.hasMany(db.resumeSkill,{ as: "resumeSkills" }, { foreignKey: "resume_id" });
db.resumeSkill.belongsTo(db.resume,{ as: "resume" }, { foreignKey: "resume_id" });

db.skill.hasMany(db.resumeSkill,{ as: "resumeSkills" }, { foreignKey: "skill_id" });
db.resumeSkill.belongsTo(db.skill,{ as: "skill" }, { foreignKey: "skill_id" });

db.resume.hasMany(db.resumeComment,{ as: "comments" }, { foreignKey: "resume_id" });
db.resumeComment.belongsTo(db.resume,{ as: "resume" }, { foreignKey: "resume_id" });

db.user.hasMany(db.resumeComment,{ as: "comments" }, { foreignKey: "user_id" });
db.resumeComment.belongsTo(db.user,{ as: "user" }, { foreignKey: "user_id" });

db.resume.hasMany(db.experience,{ as: "experiences" }, { foreignKey: "resume_id" });
db.experience.belongsTo(db.resume,{ as: "resume" }, { foreignKey: "resume_id" });

db.resume.hasMany(db.education,{ as: "education" }, { foreignKey: "resume_id" });
db.education.belongsTo(db.resume,{ as: "resume" }, { foreignKey: "resume_id" });

db.resume.hasMany(db.extraCurricular,{ as: "extraCurricular" }, { foreignKey: "resume_id" });
db.extraCurricular.belongsTo(db.resume,{ as: "resume" }, { foreignKey: "resume_id" });

db.resume.hasMany(db.honorAward,{ as: "honorAwards" }, { foreignKey: "resume_id" });
db.honorAward.belongsTo(db.resume,{ as: "resume" }, { foreignKey: "resume_id" });

db.resume.hasMany(db.project,{ as: "projects" }, { foreignKey: "resume_id" });
db.project.belongsTo(db.resume,{ as: "resume" }, { foreignKey: "resume_id" });

module.exports = db;
