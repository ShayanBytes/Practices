import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});
app.post("/register", (req, res) => {
  res.send("<h1>Register Page</h1>");
});
app.put("/user/sayan", (req, res) => {
  res.sendStatus(200);
});
app.patch("/user/sayan", (req, res) => {
  res.sendStatus(200);
});
app.delete("/user/sayan", (req, res) => {
  res.sendStatus(200);
});
// ...existing code...

// Start the server
const PORT =  3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
