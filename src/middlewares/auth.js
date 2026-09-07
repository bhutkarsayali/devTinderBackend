const jwt = require("jsonwebtoken");
const User = require("./../model/user");

const userAuth = async (req, res, next) => {
  try {
    // read the token from request cookies
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      // throw new Error("Token is not valid");
      return res.status(401).send("Please Login!!")
    }

    // validate the token
    const decodedObj = await jwt.verify(token, "Dev@Tinder$790");
    const { _id } = decodedObj;

    // find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exists");
    }
    //attaching the user in the request
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error sending the request:" + err.message);
  }
};

module.exports = {
  userAuth,
};

/**const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAutherized = token === "xyz";

  if (!isAdminAutherized) {
    res.status(401).send("Unautherized User");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "abc";
  const isUserAutherized = token === "abc";

  if (!isUserAutherized) {
    res.status(401).send("Unautherized User");
  } else {
    next();
  }
};

module.exports={
    adminAuth,
    userAuth
} 

*/
