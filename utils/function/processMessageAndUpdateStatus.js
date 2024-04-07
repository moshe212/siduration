const axios = require("axios");

const processMessageAndUpdateStatus = async (phoneNumber, msgText) => {
  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const airtableHeaders = {
    Authorization: `Bearer ${airtableApiKey}`,
    "Content-Type": "application/json",
  };

  try {
    // Fetch the row from the Invited table where the Phone column matches phoneNumber
    const response = await axios.get(
      `https://api.airtable.com/v0/${airtableBaseId}/Invited?filterByFormula={Phone}='${phoneNumber}'`,
      { headers: airtableHeaders }
    );
    const records = response.data.records;

    if (records.length > 0) {
      const record = records[0];
      const botStatus = record.fields.BotStatus;

      // Define the WhatsApp number format
      const formattedPhoneNumber = `972${phoneNumber.substring(1)}@c.us`;

      if (botStatus === 1) {
        // Logic for botStatus === 1 (existing logic)
        handleBotStatus1(
          record,
          msgText,
          formattedPhoneNumber,
          airtableBaseId,
          airtableHeaders
        );
      } else if (botStatus === 2) {
        // Logic for botStatus === 2
        await sendMessageGreenAPI({
          message:
            "Thank you for your cooperation, Serialization team! If there is a change in your arrival please update with a return message",
          number: formattedPhoneNumber,
        });

        // Update BotStatus to 3
        await axios.patch(
          `https://api.airtable.com/v0/${airtableBaseId}/Invited/${record.id}`,
          {
            fields: {
              BotStatus: 3,
            },
          },
          { headers: airtableHeaders }
        );
      } else if (botStatus === 3) {
        // Logic for botStatus === 3
        if (/^\d{1,2}$/.test(msgText)) {
          // If msgText is a valid number (1 or 2 digits)
          const countArriveAnswer = parseInt(msgText, 10);
          await updateRecord(
            record.id,
            countArriveAnswer,
            airtableBaseId,
            airtableHeaders
          );

          // Send a thank you message
          await sendMessageGreenAPI({
            message: "Thank you for your cooperation, Team Serialization!",
            number: formattedPhoneNumber,
          });
        } else {
          // Request a correct numerical response
          await sendMessageGreenAPI({
            message:
              "Please answer correctly, the answer should contain only a number representing the amount of guests coming to the event.",
            number: formattedPhoneNumber,
          });
        }
      }
      // Additional logic for botStatus === 4 and beyond can be added here
    } else {
      console.log("No record found for the provided phone number.");
    }
  } catch (error) {
    console.error("Error processing message and updating status:", error);
  }
};

const handleBotStatus1 = async (
  record,
  msgText,
  formattedPhoneNumber,
  airtableBaseId,
  airtableHeaders
) => {
  // Implement the specific logic for BotStatus 1 here
  // This is a placeholder for the logic you already have for BotStatus 1
};

const updateRecord = async (
  recordId,
  countArriveAnswer,
  airtableBaseId,
  airtableHeaders
) => {
  // Update the CountArriveAnswer and BotStatus in the Airtable record
  await axios.patch(
    `https://api.airtable.com/v0/${airtableBaseId}/Invited/${recordId}`,
    {
      fields: {
        CountArriveAnswer: countArriveAnswer,
        Is_Arriving: countArriveAnswer > 0,
        BotStatus: countArriveAnswer > 0 ? 4 : 3, // Example logic, adjust as needed
      },
    },
    { headers: airtableHeaders }
  );
};

module.exports = { processMessageAndUpdateStatus };
