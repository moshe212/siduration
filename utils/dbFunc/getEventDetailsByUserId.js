const Airtable = require("airtable");

const getEventDetailsByUserId = async ({ userId }) => {
  console.log("getEventDetailsByUserId");
  console.log("UserID:", userId);

  // Retrieve API Key and Base ID from environment variables
  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const airtableBase = new Airtable({ apiKey: airtableApiKey }).base(
    airtableBaseId
  );

  // Connect to the 'Events' table
  const eventsTable = airtableBase("Events");

  try {
    // Query the 'Events' table for a record matching the UserID
    const records = await eventsTable
      .select({
        filterByFormula: `{UserID} = '${userId}'`,
        maxRecords: 1, // Assuming we only need one record matching the UserID
      })
      .firstPage();

    if (records.length === 0) {
      console.log("No event found for the provided UserID.");
      return null;
    }

    // Extract required fields from the first matching record
    const event = records[0].fields;
    const eventData = {
      YesAmount: event["YesAmount"] || 0,
      NoAmount: event["NoAmount"] || 0,
      MaybeAmount: event["MaybeAmount"] || 0,
      NotAnswerAmount: event["NotAnswerAmount"] || 0,
      TotalArrived: event["TotalArrived"] || 0,
      TotalInvited: event["TotalInvited"] || 0,
    };

    console.log("Event Details:", eventData);
    return eventData;
  } catch (error) {
    console.error("An error occurred while fetching event details:", error);
    return null;
  }
};

module.exports = { getEventDetailsByUserId };
