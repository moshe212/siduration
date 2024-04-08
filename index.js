const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const schedule = require("node-schedule");

dotenv.config();
const server = http.createServer(app);

const { dbFunc } = require("./utils/dbFunc/index");
const { waMessageFunc } = require("./utils/function/index");

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
  // const userId = _req.body.userId || 0; // Default to 0 if undefined
  // const excelFileUrl = _req.body.excelFileUrl || ""; // Default to an empty string if undefined
  // const eventId = _req.body.eventId || "";
  // console.log(userId, excelFileUrl, eventId);
  // dbFunc
  //   .createInvitedFromFile({
  //     userId,
  //     excelFileUrl,
  //     eventIdFromAdalo: eventId,
  //   })
  //   .then((data) => {
  //     // Assuming `data` is what the promise resolves with
  //     console.log(`createInvitedFromFile: ${data}`);
  //     // Successfully added row, send back a success response
  //     res.status(200).send("ok");
  //   })
  //   .catch((error) => {
  //     // Properly catch and handle any errors
  //     console.error(error); // Log the error for debugging
  //     res
  //       .status(500)
  //       .send(
  //         "error on create createInvitedFromFile rows in Events table: " + error
  //       );
  //   });
});

app.post("/api/updateAmountSeats", async (_req, res) => {
  console.log("updateAmountSeats");
  console.log("req", _req.body);
  const { eventID, tableID, amountSeats } = _req.body;
  console.log(eventID, tableID, amountSeats);

  dbFunc
    .updateAmountSeats({
      eventID,
      tableID,
      amountSeats,
    })
    .then((data) => {
      // Assuming `data` is what the promise resolves with
      console.log(`updateAmountSeats: ${data}`);
      // Successfully added row, send back a success response
      res.status(200).send("ok");
    })
    .catch((error) => {
      // Properly catch and handle any errors
      console.error(error); // Log the error for debugging
      res
        .status(500)
        .send(
          "error on update updateAmountSeats rows in TableOfEvent table: " +
            error
        );
    });
});

app.post("/api/deleteTable", async (_req, res) => {
  console.log("deleteTable");
  console.log("req", _req.body);
  const { eventID, tableID } = _req.body;
  console.log(eventID, tableID);

  dbFunc
    .deleteTable({
      eventID,
      tableID,
    })
    .then((data) => {
      // Assuming `data` is what the promise resolves with
      console.log(`deleteTable: ${data}`);
      // Successfully added row, send back a success response
      res.status(200).send("ok");
    })
    .catch((error) => {
      // Properly catch and handle any errors
      console.error(error); // Log the error for debugging
      res
        .status(500)
        .send("error on deleteTable rows in Events table: " + error);
    });
});

app.post("/api/addInvitedToTable", async (_req, res) => {
  console.log("addInvitedToTable");
  console.log("req", _req.body);
  const { eventID, invitedID, tableID } = _req.body;
  console.log(eventID, invitedID, tableID);

  dbFunc
    .addTableToInvited({
      eventID,
      invitedID,
      tableID,
    })
    .then((data) => {
      // Assuming `data` is what the promise resolves with
      console.log(`addTableToInvited: ${data}`);
      // Successfully added row, send back a success response
      res.status(200).send("ok");
    })
    .catch((error) => {
      // Properly catch and handle any errors
      console.error(error); // Log the error for debugging
      res.status(500).send("error on addTableToInvited: " + error);
    });
});

app.post("/api/sendTestMessage", async (_req, res) => {
  console.log("sendTestMessage");
  console.log("req", _req.body);
  const { msgText, langID, eventID } = _req.body;
  console.log(msgText, langID, eventID);

  waMessageFunc
    .sendTestMessage({
      eventID,
      msgText,
      langID,
    })
    .then((data) => {
      // Assuming `data` is what the promise resolves with
      console.log(`sendTestMessage: ${data}`);
      // Successfully added row, send back a success response
      res.status(200).send("ok");
    })
    .catch((error) => {
      // Properly catch and handle any errors
      console.error(error); // Log the error for debugging
      res.status(500).send("error on sendTestMessage: " + error);
    });
});

app.post("/api/saveMsg", async (_req, res) => {
  console.log("saveMsg");
  console.log("req", _req.body);
  const { msgText, langID, msgTime, eventID } = _req.body;
  console.log(msgText, langID, msgTime);

  dbFunc
    .updateEventMessageAndTime({
      msgText,
      langID,
      msgTime,
      eventID,
    })
    .then((data) => {
      // Assuming `data` is what the promise resolves with
      console.log(`saveMsg: ${data}`);
      // Successfully added row, send back a success response
      res.status(200).send("ok");
    })
    .catch((error) => {
      // Properly catch and handle any errors
      console.error(error); // Log the error for debugging
      res.status(500).send("error on saveMsg: " + error);
    });
});

app.post("/api/processMessage", async (_req, res) => {
  const isIncomimgMsg = _req.body.typeWebhook === "incomingMessageReceived";
  const isTextMessage = _req.body.messageData?.typeMessage === "textMessage";
  const isExtendedTextMessage =
    _req.body.messageData?.typeMessage === "extendedTextMessage";

  console.log("processMessage");
  console.log("req", _req.body);
  if (isIncomimgMsg && (isTextMessage || isExtendedTextMessage)) {
    const chatId = _req.body.senderData.chatId;
    if (chatId === "972557232453@c.us") {
      const senderNum = _req.body.senderData.sender;
      console.log({ senderNum });
      const phoneNumber = `(0${senderNum.substring(
        3,
        5
      )}) ${senderNum.substring(5, 8)}-${senderNum.substring(8, 12)}`;
      // const phoneNumber = _req.body.senderData.sender
      //   .replace(/^972/, "0")
      //   .replace(/@c\.us$/, "");
      const msgText = isTextMessage
        ? _req.body.messageData.textMessageData.textMessage
        : _req.body.messageData.extendedTextMessageData.text;

      console.log(msgText, phoneNumber);
      // res.status(200).send("ok");
      waMessageFunc
        .processMessageAndUpdateStatus({
          msgText,
          phoneNumber,
        })
        .then((data) => {
          // Assuming `data` is what the promise resolves with
          console.log(`processMessage: ${data}`);
          // Successfully added row, send back a success response
          res.status(200).send("ok");
        })
        .catch((error) => {
          // Properly catch and handle any errors
          console.error(error); // Log the error for debugging
          res.status(500).send("error on processMessage: " + error);
        });
    } else {
      console.log("is not test number");
      res.status(200).send("is not test number");
    }
  } else {
    console.log("is not incoming message");
    res.status(200).send("is not incoming message");
  }
});

app.post("/api/updateTotalInvitedInEventsTable", async (_req, res) => {
  console.log("updateTotalInvitedInEventsTable");
  console.log("req", _req.body);
  const { eventID } = _req.body;
  console.log(eventID);

  dbFunc
    .updateTotalInvitedInEventsTable({
      eventID,
    })
    .then((data) => {
      // Assuming `data` is what the promise resolves with
      console.log(`updateTotalInvitedInEventsTable: ${data}`);
      // Successfully added row, send back a success response
      res.status(200).send("ok");
    })
    .catch((error) => {
      // Properly catch and handle any errors
      console.error(error); // Log the error for debugging
      res
        .status(500)
        .send("error on updateTotalInvitedInEventsTable: " + error);
    });
});

app.get("/", (req, res) => {
  res.redirect("/he");
});

const job1 = schedule.scheduleJob("0 * * * *", waMessageFunc.sendThanksMessage);
const job2 = schedule.scheduleJob("0 * * * *", waMessageFunc.sendInviteMessage);
const job3 = schedule.scheduleJob("0 * * * *", waMessageFunc.sendRemindMessage);

// waMessageFunc.sendRemindMessage();

// Start the server
server.listen(port, () => {
  console.log(`Server runningg on port ${port}`);
});
