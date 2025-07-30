import express from "express";
const app = express();

const port = 3000;

app.get("/", (req, res) => {
  // console.log(req.rawHeaders)
  res.send(
   "<h1>hello world</h1>"
  );
});

app.listen(3000, () => {
  console.log(`your port ${port}`);
});
