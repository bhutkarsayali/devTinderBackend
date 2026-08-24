const mongoose = require("mongoose");

const connectToDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sayalibhutkar1111_db_user:Pranav1234@clusternamastenode.5kixwkc.mongodb.net/devTinder",
  );
};

// connectToDB().then(()=>{
//    console.log("DB connection established successfully")
// }).catch(err => {
//    console.error("Not connected to DB")
// })

// not calling here directly, we need to first connect to db and then listen to the server, so
// exporting connectToDB function from here and will use it in app.js and once the database it connected, then
// server start listening

module.exports = { connectToDB };
