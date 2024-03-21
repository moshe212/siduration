const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();
const server = http.createServer(app);

const { dbFunc } = require("./utils/dbFunc/index");

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Amadeus.nm2024@gmail.com",
    pass: "wkzl kyol tclv leut",
  },
});

// CORS Configuration
app.use(
  cors({
    origin: "*", // Replace with your frontend URL
    methods: ["GET", "POST"],
  })
);

const sendMail = (an, mail) => {
  let mailOptions = {
    from: "Amadeus.nm2024@gmail.com",
    to: mail,
    subject: `you got DK1 on ${an}`,
    text: `go to browser..`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send("error"); // If error occurs, send error response
    } else {
      console.log("Email sent: " + info.response);
      res.send("success"); // If success, send success response
    }
  });
};

app.post("/api/createTableOfEventRows", async (_req, res) => {
  console.log("Adalo");
  console.log("req", _req.body);
  const { TableID, EventID } = _req.body;
  dbFunc.addTableOfEventRows({ UserID, TableID, EventID }).then((res) => {
    console.log(`addTableOfEventRows: ${res}`);
    if (error) {
      console.log(error);
      res
        .status(500)
        .send("error on add row to TableOfEventRows table: " + error);
    } else {
      console.log(data);
      res.status(200).send("ok");
    }
  });
});

app.get("/", (req, res) => {
  res.redirect("/he");
});

// Start the server
server.listen(port, () => {
  console.log(`Server runningg on port ${port}`);
});
