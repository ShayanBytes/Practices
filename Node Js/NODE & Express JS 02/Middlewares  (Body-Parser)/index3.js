//Creting Custom MiddleWare

import express from "express";

const app = express();
const port = 3000;
function customMiddleware(req,res,next){
  console.log("request Method:",req.method);
  console.log("Request URL:",req.url);
  next()
  }
app.use(customMiddleware);

app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
