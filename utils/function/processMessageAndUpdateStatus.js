const axios = require("axios");
const { sendMessageGreenAPI } = require("./sendMessageGreenAPI");

const processMessageAndUpdateStatus = async ({ phoneNumber, msgText }) => {
  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const airtableHeaders = {
    Authorization: `Bearer ${airtableApiKey}`,
    "Content-Type": "application/json",
  };

  console.log({ phoneNumber });
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/${airtableBaseId}/Invited?filterByFormula={Phone}='${phoneNumber}'`,
      { headers: airtableHeaders }
    );
    const records = response.data.records;

    if (records.length > 0) {
      const record = records[0];
      const botStatus = record.fields.BotStatus;

      // const formattedPhoneNumber = phoneNumber.replace(/^0/, "972") + "@c.us";

      const formattedPhoneNumber = `${phoneNumber
        .replace("(", "")
        .replace(")", "")
        .replace("-", "")
        .replace(" ", "")
        .replace(/^0/, 972)}@c.us`;

      console.log({ formattedPhoneNumber });
      // Check if msgText is a valid number and not more than two characters
      const numberFromText = parseInt(msgText, 10);
      const isValidNumber =
        Number.isInteger(numberFromText) &&
        msgText.trim().length <= 2 &&
        msgText.trim().length > 0;
      const isWithinRange = numberFromText >= 0 && numberFromText <= 99;
      const countArriveAnswer =
        isValidNumber && isWithinRange ? parseInt(msgText, 10) : null;

      switch (botStatus) {
        case 1:
          if (isValidNumber && isWithinRange) {
            await updateRecord(
              record.id,
              countArriveAnswer,
              botStatus + 1,
              airtableBaseId,
              airtableHeaders
            );

            // Send a thank you message
            await sendMessageGreenAPI({
              message: "תודה על שיתוף הפעולה צוות סידוריישן!",
              number: formattedPhoneNumber,
            });
          } else {
            // Request a correct numerical response
            await sendMessageGreenAPI({
              message:
                "נא לענות נכון, התשובה צריכה להכיל רק מספר (1 או 2 ספרות) המייצג את כמות האורחים המגיעים לאירוע.",
              number: formattedPhoneNumber,
            });
          }
          break;
        case 2:
          await updateRecord(
            record.id,
            countArriveAnswer,
            botStatus + 1,
            airtableBaseId,
            airtableHeaders
          );

          await sendMessageGreenAPI({
            message:
              "תודה על שיתוף הפעולה צוות סידוריישן!  \n אם חל שינוי בהגעתך אנא עדכן בהודעה חוזרת",
            number: formattedPhoneNumber,
          });
          break;
        case 3:
          // For botStatus 2 and 3, the logic is similar but with different messages
          if (isValidNumber && isWithinRange) {
            // Update the record with the count and increment botStatus
            await updateRecord(
              record.id,
              countArriveAnswer,
              botStatus + 1,
              airtableBaseId,
              airtableHeaders
            );
            // Send a thank you message
            await sendMessageGreenAPI({
              message: "תודה על שיתוף הפעולה צוות סידוריישן!",
              number: formattedPhoneNumber,
            });
          } else {
            // Request a correct numerical response
            await sendMessageGreenAPI({
              message:
                "נא לענות נכון, התשובה צריכה להכיל רק מספר (1 או 2 ספרות) המייצג את כמות האורחים המגיעים לאירוע.",
              number: formattedPhoneNumber,
            });
          }
          break;
        // Add additional cases for botStatus as needed
        default:
          console.log(`Unhandled botStatus: ${botStatus}`);
          break;
      }
    } else {
      console.log("No record found for the provided phone number.");
    }
  } catch (error) {
    console.error("Error processing message and updating status:", error);
  }
};

const updateRecord = async (
  recordId,
  countArriveAnswer,
  newBotStatus,
  airtableBaseId,
  airtableHeaders
) => {
  // Update the record in Airtable with new information
  const fieldsToUpdate = {
    BotStatus: newBotStatus,
  };
  if (countArriveAnswer !== null) {
    fieldsToUpdate.CountArriveAnswer = countArriveAnswer;
    fieldsToUpdate.Is_Arriving = countArriveAnswer > 0;
  }

  await axios.patch(
    `https://api.airtable.com/v0/${airtableBaseId}/Invited/${recordId}`,
    { fields: fieldsToUpdate },
    { headers: airtableHeaders }
  );
};

module.exports = { processMessageAndUpdateStatus };
