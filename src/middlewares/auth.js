const adminAuth = (req, res, next) => {
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