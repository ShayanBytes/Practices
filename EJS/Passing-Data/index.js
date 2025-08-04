import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    console.log("Your name has ",fnameLength ,"letters");
});

app.post("/submit", (req, res) => {
  res.render("index.ejs",
    { name: req.body["fName","lName"]}
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
