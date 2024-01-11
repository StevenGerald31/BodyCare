const getBaseUrl = require("../../utils/getBaseUrl");

const pageDashboard = async (req, res) => {
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

const pageLogin = async (req, res) => {
  try {
    return res.render("login", {
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

const pageAdmin = async (req, res) => {
  try {
    return res.render("admin", {
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

module.exports = { pageDashboard, pageLogin, pageAdmin };
