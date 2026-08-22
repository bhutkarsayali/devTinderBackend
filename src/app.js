const express = require("express");
const app = express();

app.use("/test",(req, res)=> {
    res.send("Hello from  testserver")
})

app.use("/hello",(req, res)=> {
    res.send("Hello hello hello")
})

app.listen(3000, () => {
  console.log("Server is successfully listening to port 3000");
});
