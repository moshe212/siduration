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
  const { UserID, EventID, TableCount } = _req.body;

  dbFunc
    .addTableOfEventRows_Airtable({ UserID, EventID, TableCount })
    .then((data) => {
      // Assuming `data` is what the promise resolves with
      console.log(`addTableOfEventRows: ${data}`);
      // Successfully added row, send back a success response
      res.status(200).send("ok");
    })
    .catch((error) => {
      // Properly catch and handle any errors
      console.error(error); // Log the error for debugging
      res
        .status(500)
        .send("error on add row to TableOfEventRows table: " + error);
    });
});

app.post("/api/updateInvitedArrivedCount", async (_req, res) => {
  console.log("updateInvitedArrivedCount");
  console.log("req", _req.body);
  const { TableID, EventID, InvitedID, ActualArrivedCount } = _req.body;

  dbFunc
    .updateInvitedArrivedCount({
      TableID,
      EventID,
      InvitedID,
      ActualArrivedCount,
    })
    .then((data) => {
      // Assuming `data` is what the promise resolves with
      console.log(`updateInvitedArrivedCount: ${data}`);
      // Successfully added row, send back a success response
      res.status(200).send("ok");
    })
    .catch((error) => {
      // Properly catch and handle any errors
      console.error(error); // Log the error for debugging
      res
        .status(500)
        .send(
          "error on update InvitedArrivedCount in TableOfEventRows table: " +
            error
        );
    });
});

app.post("/api/createInvitedsFromFile", async (_req, res) => {
  console.log("createInvitedsFromFile");
  console.log("req", _req.body);
  const { userId, excelFileUrl } = _req.body;

  dbFunc
    .createInvitedFromFile({
      userId,
      excelFileUrl,
    })
    .then((data) => {
      // Assuming `data` is what the promise resolves with
      console.log(`createInvitedFromFile: ${data}`);
      // Successfully added row, send back a success response
      res.status(200).send("ok");
    })
    .catch((error) => {
      // Properly catch and handle any errors
      console.error(error); // Log the error for debugging
      res
        .status(500)
        .send(
          "error on create createInvitedFromFile rows in Events table: " + error
        );
    });
});

app.get("/", (req, res) => {
  res.redirect("/he");
});

// Start the server
server.listen(port, () => {
  console.log(`Server runningg on port ${port}`);
});
