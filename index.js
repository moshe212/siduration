const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

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
  res.status(200).end();
});

app.get("/", (req, res) => {
  res.redirect("/he");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
