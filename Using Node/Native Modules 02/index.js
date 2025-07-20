const fs = require("fs");

// fs.writeFile("message.txt", "Sayan is gonna win", (err) => {
//   if (err) throw err;
//   console.log("The file has been saved perfectly");
// });


fs.readFile('./message.txt',"utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
}); 