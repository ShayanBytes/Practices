import express from "express";
const app = express();
const port= 3000;

app.listen(3000, ()=>{
    console.log(`Your server is running on port ${port}`);
})