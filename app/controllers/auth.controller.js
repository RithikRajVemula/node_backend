const db = require("../models");
const { authenticate } = require("../authentication/authentication");
const User = db.user;
const Session = db.session;
const Op = db.Sequelize.Op;
const { encrypt } = require("../authentication/crypto");

exports.login = async (req, res) => {
  let { userId } = await authenticate(req, res, "credentials");

  if (userId !== undefined) {
    let user = {};
    await User.findByPk(userId).then((data) => {
      user = data;
    });

    let expireTime = new Date();
    expireTime.setDate(expireTime.getDate() + 1);

    const session = {
      email: user.email,
      userId: userId,
      expiration_date: expireTime,
    };
    await Session.create(session).then(async (data) => {
      let sessionId = data.id;
      let token = await encrypt(sessionId);
      let userInfo = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        id: user.id,
        is_admin: user.is_admin,
        token: token,
        phone_number: user.phone_number,
        address: user.address,
        linkedin_url: user.linkedin_url,
        portfolio: user.portfolio,
        professional_summary: user.professional_summary,
      };
      res.send(userInfo);
    });
  }
};

exports.logout = async (req, res) => {
  let auth = req.get("authorization");
  console.log(auth);
  if (
    auth != null &&
    auth.startsWith("Bearer ") &&
    (typeof require !== "string" || require === "token")
  ) {
    let token = auth.slice(7);
    let sessionId = await decrypt(token);
    if (sessionId == null) return;
    return await Session.destroy({ where: { id: sessionId } }).catch(
      (error) => {
        console.log(error);
      }
    );
  }
};