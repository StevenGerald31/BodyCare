module.exports = (req) => `${req.protocol}://${req.get("host")}`;
