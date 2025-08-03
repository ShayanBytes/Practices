import express from "express";
import ejs from "ejs";

const specificDate = new Date("2023-05-25");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.render("index.ejs" ,{
        result: specificDate

    });
    

});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});