const getBaseUrl = require("../../utils/getBaseUrl");

const pageBeranda = async (req, res) => {
  try {
    return res.render("dashboard", {
      baseUrl: getBaseUrl(req),
      session: req.session,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Terjadi Kesalahan Sistem",
    });
  }
};

module.exports = { pageBeranda };
