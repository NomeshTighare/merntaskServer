const jwt = require("jsonwebtoken");
module.exports = {
  checkToken: async (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
        req.user = decoded;
        if (err) {
          return res.json({
            status: false,
            message: "Invalid Token...",
          });
        }
        next();
      });
    } else {
      return res.json({
          status:false,
        message: "Invalid Token! Unauthorized User"
      });
    }
  }
};
