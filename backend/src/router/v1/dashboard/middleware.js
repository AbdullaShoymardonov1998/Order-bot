const authFunctions = require("../../../util/auth");

async function hasAccess(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const jwt = token.split(" ")[1];

  if (!jwt) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  let decoded = await authFunctions.decode(jwt);

  if (!decoded) {
    res.status(401).json({ message: "Token is expired" });
    return;
  }
  res.locals.accountId = decoded.accountId;
  next();
}

module.exports = hasAccess;
