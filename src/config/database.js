const mongoose = require("mongoose");

const connectToDB = async () => {
  console.log(process.env.DB_CONNECTION_SECRET)
  await mongoose.connect(
    process.env.DB_CONNECTION_SECRET,
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
