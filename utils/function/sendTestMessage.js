const axios = require("axios");
const { sendMessageGreenAPI } = require("./sendMessageGreenAPI");
const { extractDateAndHour } = require("./extractDateAndHour");

const sendTestMessage = async (msgText, eventID) => {
  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const phoneNumber = "972523587990@c.us"; // Target phone number
  const airtableHeaders = {
    Authorization: `Bearer ${airtableApiKey}`,
    "Content-Type": "application/json",
  };

  try {
    // Fetch event details from Airtable
    const response = await axios.get(
      `https://api.airtable.com/v0/${airtableBaseId}/Events?filterByFormula={EventID}='${eventID}'`,
      { headers: airtableHeaders }
    );
    const records = response.data.records;

    if (records.length > 0) {
      const event = records[0].fields;
      const userFullName = event.UserFullName;
      const eventDate = event.Date;

      // Extract and format the event date
      const { date: cleanDate } = await extractDateAndHour({
        isoDateString: eventDate,
      });

      // Replace placeholders in the message text
      let personalizedMessage = msgText
        .replace("{CapleName}", userFullName)
        .replace("{EventDate}", cleanDate);

      const res = await sendMessageGreenAPI({
        message: personalizedMessage,
        number: phoneNumber,
      });

      if (res === true) {
        console.log("Message sent successfully", res);
        return true;
      } else return false;
    } else {
      console.log("No event found with the provided ID:", eventID);
      return false;
    }
  } catch (error) {
    console.error("Error in sending custom message:", error);
    return false;
  }
};

module.exports = { sendTestMessage };
