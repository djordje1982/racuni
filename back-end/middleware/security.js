const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.get("Authorization");
  console.log(header);
  if (!header) {
    return res.json({
      status: 400,
      message: "Niste autorizovani",
    });
  }
  const token = header.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_HASH);
  } catch (err) {
    return res.json({
      status: 401,
      message: "Niste autorizovani",
    });
  }
  if (!decodedToken) {
    return res.json({
      status: 402,
      message: "Niste autorizovani",
    });
  }
  req.userId = decodedToken.userId;
  next();
};
