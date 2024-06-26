const axios = require("axios");

const updateEventMessageAndTime = async ({
  msgText,
  langID,
  msgTime,
  eventID,
}) => {
  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const airtableHeaders = {
    Authorization: `Bearer ${airtableApiKey}`,
    "Content-Type": "application/json",
  };

  // Determine the text column to update based on langID
  let textColumnToUpdate;
  switch (langID) {
    case 1:
      textColumnToUpdate = "Invite_Heb";
      break;
    case 2:
      textColumnToUpdate = "Remind_Heb";
      break;
    case 3:
      textColumnToUpdate = "Thanks_Heb";
      break;
    case 4:
      textColumnToUpdate = "Invite_Eng";
      break;
    case 5:
      textColumnToUpdate = "Remind_Eng";
      break;
    case 6:
      textColumnToUpdate = "Thanks_Eng";
      break;
    default:
      console.error("Invalid LangID");
      return;
  }

  // Determine the time column to update based on langID
  let timeColumnToUpdate;
  if ([1, 4].includes(langID)) {
    timeColumnToUpdate = "InviteMsg_Time";
  } else if ([2, 5].includes(langID)) {
    timeColumnToUpdate = "RemindMsg_Time";
  } else if ([3, 6].includes(langID)) {
    timeColumnToUpdate = "ThanksMsg_Time";
  }

  function convertSerialDateToJSDate(serialDate) {
    // Excel's epoch starts on December 30, 1899
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    // Split the serial date into its integer and fractional components
    const days = Math.floor(serialDate);
    const fractionOfDay = serialDate - days;
    // Milliseconds in a day
    const msInDay = 24 * 60 * 60 * 1000;
    // Calculate the date by adding the days to the epoch
    const date = new Date(excelEpoch.getTime() + days * msInDay);
    // Calculate the time by adding the fractional days to the date
    const time = new Date(date.getTime() + fractionOfDay * msInDay);
    return time;
  }

  try {
    // Fetch the specific event row from the Events table
    const response = await axios.get(
      `https://api.airtable.com/v0/${airtableBaseId}/Events?filterByFormula={EventID}='${eventID}'`,
      { headers: airtableHeaders }
    );
    const records = response.data.records;

    if (records.length > 0) {
      const jsDate = convertSerialDateToJSDate(msgTime);
      const eventRecordId = records[0].id;
      // Update the specified text and time columns for the event
      await axios.patch(
        `https://api.airtable.com/v0/${airtableBaseId}/Events/${eventRecordId}`,
        {
          fields: {
            [textColumnToUpdate]: msgText,
            [timeColumnToUpdate]: jsDate.toISOString(), // Update to current time
          },
        },
        { headers: airtableHeaders }
      );
      console.log(
        `Event message and time updated successfully for EventID: ${eventID}`
      );
    } else {
      console.log("No event found with the provided ID:", eventID);
    }
  } catch (error) {
    console.error("Error updating event message and time:", error);
  }
};

module.exports = { updateEventMessageAndTime };
