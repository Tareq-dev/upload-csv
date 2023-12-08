const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const csv = require("fast-csv");
const fs = require("fs");
const { db } = require("./dbConfig/db");

//multer config

let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({
  storage: storage,
});

function uploadCsv(path) {
  let stream = fs.createReadStream(path);
  let csvDataColl = [];
  let fileStream = csv
    .parse()
    .on("data", function (data) {
      csvDataColl.push(data);
    })
    .on("end", function () {
      csvDataColl = csvDataColl.filter((data) => data.length > 0);
      csvDataColl.shift();
      let query =
        "INSERT INTO assignment_data (name,email,batch_no,course_name,assignment_no,assignment_mark) VALUE ?";
      db.query(query, [csvDataColl], (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      });
      fs.unlinkSync(path);
    });
  stream.pipe(fileStream);
}
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/import-csv", upload.single("file"), (req, res) => {
  console.log(req.file.path);
  uploadCsv(__dirname + "/uploads/" + req.file.filename);
});

app.listen(5000, () => {
  console.log("App is running on post 5000");
});
