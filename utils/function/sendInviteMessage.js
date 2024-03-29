const axios = require("axios");
const { sendMessageGreenAPI } = require("./sendMessageGreenAPI");
const { extractDateAndHour } = require("./extractDateAndHour");

const sendInviteMessage = async () => {
  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const airtableHeaders = {
    Authorization: `Bearer ${airtableApiKey}`,
    "Content-Type": "application/json",
  };

  const getCurrentDateTimeISO = () => {
    return new Date().toISOString(); // Get current date and time in ISO format
  };

  const sendMessageWithGreenApi = async (phoneNumber, message) => {
    try {
      let newNumber = phoneNumber.startsWith("0")
        ? phoneNumber.slice(1)
        : phoneNumber;
      const formattedPhoneNumber = `972${newNumber}@c.us`;
      console.log({ phoneNumber });
      console.log({ newNumber });
      console.log({ formattedPhoneNumber });

      // Send WhatsApp message
      const res = await sendMessageGreenAPI({
        message: message,
        number: formattedPhoneNumber,
      });

      if (res === true) {
        console.log("Message sent successfully", res);
        return true;
      } else return false;
    } catch (error) {
      console.error("Failed to send message via GreenApi", error);
      return false; // Failed to send message
    }
  };

  const updateInviteMsgStatus = async (recordId, status) => {
    const statusMessage = status ? "Sent" : "Failed";
    const dateTimeNow = getCurrentDateTimeISO(); // Get current date and time
    try {
      await axios.patch(
        `https://api.airtable.com/v0/${airtableBaseId}/Invited/${recordId}`,
        {
          fields: {
            InviteMsgStatus: dateTimeNow,
          },
        },
        { headers: airtableHeaders }
      );
      console.log(
        `InviteMsgStatus updated to ${statusMessage} on ${dateTimeNow} for record ID: ${recordId}`
      );
    } catch (error) {
      console.error("Failed to update InviteMsgStatus in Airtable", error);
    }
  };

  const fetchInvitedAndSendMessage = async (
    eventId,
    messageTemplate,
    userFullName,
    eventDate
  ) => {
    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/${airtableBaseId}/Invited?filterByFormula={EventID}='${eventId}'`,
        { headers: airtableHeaders }
      );
      const records = response.data.records;
      records.forEach(async (record, index) => {
        if (record.fields.DoSendMessage === "true") {
          const delay = Math.random() * (60000 - 30000) + 30000;
          setTimeout(async () => {
            const phoneNumber = record.fields.Phone;
            const { date: cleanDate } = await extractDateAndHour({
              isoDateString: eventDate,
            });
            let personalizedMessage = messageTemplate
              .replace("{CapleName}", userFullName)
              .replace("{EventDate}", cleanDate)
              .replace(
                "{InvitedName}",
                `${record.fields.First_Name} ${record.fields.Last_Name}`
              );
            const messageSentSuccessfully = await sendMessageWithGreenApi(
              phoneNumber,
              personalizedMessage
            );
            await updateInviteMsgStatus(record.id, messageSentSuccessfully);
          }, delay * index);
        }
      });
    } catch (error) {
      console.error("Failed to fetch Invited records or send messages", error);
    }
  };

  const checkEventsAndNotify = async () => {
    try {
      const currentDate = getCurrentDateTimeISO();
      const response = await axios.get(
        `https://api.airtable.com/v0/${airtableBaseId}/Events`,
        { headers: airtableHeaders }
      );
      const events = response.data.records;

      events.forEach(async (event) => {
        const eventDate = event.fields.Date;
        const inviteMsg_Time = event.fields.InviteMsg_Time;

        const { date: current_date, hour: current_hour } =
          await extractDateAndHour({
            isoDateString: currentDate,
          });

        console.log({ current_date });
        console.log({ current_hour });

        const { date: inviteMsg_date, hour: inviteMsg_hour } =
          await extractDateAndHour({
            isoDateString: inviteMsg_Time,
          });
        console.log({ inviteMsg_date });
        console.log({ inviteMsg_hour });

        if (
          inviteMsg_date === current_date &&
          inviteMsg_hour === current_hour
        ) {
          const eventId = event.fields.EventID;
          const messageTemplate = event.fields.Invite_Heb;
          const userFullName = event.fields.UserFullName;
          fetchInvitedAndSendMessage(
            eventId,
            messageTemplate,
            userFullName,
            eventDate
          );
        } else {
          console.log("Not fount event that have inviteMessage in this time");
        }
      });
    } catch (error) {
      console.error("Failed to fetch events or process notifications", error);
    }
  };

  checkEventsAndNotify();
};

module.exports = { sendInviteMessage };
