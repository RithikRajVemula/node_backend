const db = require("../models");
const Resume = db.resume;
const ResumeSkill = db.resumeSkill;
const Skill = db.skill;
const Experience = db.experience;
const Education = db.education;
const ExtraCurricular = db.extraCurricular;
const HonorAward = db.honorAward;
const Project = db.project;
const User = db.user;
const ResumeComment = db.resumeComment;
const { sequelize } = db;
// const { generateResumeUsingLLM  } = require("../utils/utils")


const createOrUpdateSkills = async (resumeSkills, transaction) => {
  const skillIds = [];

  for (const skillData of resumeSkills) {
    let skill;
    if (skillData.skill && skillData.skill.name) {
      skill = await Skill.findOne({ where: { name: skillData.skill.name } });
    }

    if (!skill) {
      const createdSkill = await Skill.create({
        name: skillData.skill.name
      }, { transaction });
      skillIds.push(createdSkill.id);
    } else {
      skillIds.push(skill.id);
    }
  }

  return skillIds;
};


const createResumeSkills = async (resumeId, skillIds, transaction) => {
  await Promise.all(skillIds.map(skillId => {
    return ResumeSkill.create({ resumeId: resumeId, skillId: skillId }, { transaction });
  }));
};

const createOrUpdateEntities = async (resumeId, entityData, entityModel, transaction) => {
  await entityModel.destroy({ where: { resumeId: resumeId }, transaction });
  await Promise.all(entityData.map(data => {
    data.resumeId = resumeId;
    return entityModel.create(data, { transaction });
  }));
};

exports.create = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // const { filePath } = await generateResumeUsingLLM(req.body);
    const { userDetails,userId, resumeSkills, experiences, education, extraCurricular, honorAwards, projects } = req.body;

    const resume = await Resume.create({ userId,
      email: userDetails.email,
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      phone_number: userDetails.phone_number,
      address: userDetails.address,
      linkedin_url: userDetails.linkedin_url,
      portfolio: userDetails.portfolio,
      professional_summary: userDetails.professional_summary,
      mobile: userDetails.mobile,
      generated_resume_url: "filePath"
    }, { transaction});

    console.log("req body", req.body);

    const skillIds = await createOrUpdateSkills(resumeSkills, transaction);
    await createResumeSkills(resume.id, skillIds, transaction);
    await createOrUpdateEntities(resume.id, experiences, Experience, transaction);
    await createOrUpdateEntities(resume.id, education, Education, transaction);
    await createOrUpdateEntities(resume.id, extraCurricular, ExtraCurricular, transaction);
    await createOrUpdateEntities(resume.id, honorAwards, HonorAward, transaction);
    await createOrUpdateEntities(resume.id, projects, Project, transaction);

    await transaction.commit();
    res.send({
        message:  "Resume Created Successfully!",
        id: resume.id,
        url: resume.generated_resume_url
      });
  } catch (error) {
    console.log("error",error);
    await transaction.rollback();
    res.status(500).send({
      message: error.message || "Some error occurred while creating the Resume."
    });
  }
};

exports.findAll = async (req, res) => {  
    Resume.findAll({
        include: [
          { model: ResumeSkill, as: 'resumeSkills', include: [{ model: Skill, as:'skill'}]},
          { model: Experience, as: 'experiences' },
          { model: Education, as: 'education' },
          { model: ExtraCurricular, as: 'extraCurricular' },
          { model: HonorAward, as: 'honorAwards' },
          { model: Project, as: 'projects' },
          { model: ResumeComment, as: 'comments', include: [{ model: User, as: 'user' }] }
        ]
      }).then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving resumes.",
        });
      });
  };

exports.findOne = async (req, res) => {
    const id = req.params.id;
  
    try {
      const resume = await Resume.findByPk(id, {
        include: [
          { model: ResumeSkill, as: 'resumeSkills', include: [{ model: Skill, as:'skill'}]},
          { model: Experience, as: 'experiences' },
          { model: Education, as: 'education' },
          { model: ExtraCurricular, as: 'extraCurricular' },
          { model: HonorAward, as: 'honorAwards' },
          { model: Project, as: 'projects' },
          { model: ResumeComment, as: 'comments', include: [{ model: User, as: 'user' }] }
        ]
      });
  
      if (!resume) {
        return res.status(404).send({ message: "Resume's not found" });
      }
  
      res.send(resume);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving the Resume."
      });
    }
  };
  
