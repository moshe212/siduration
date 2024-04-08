const Airtable = require("airtable");

const updateTotalInvitedInEventsTable = async (eventID) => {
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_API_KEY,
  });
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

  // Table names
  const invitedTable = base("Invited");
  const eventsTable = base("Events");

  try {
    let sumAmountInvited = 0;

    // Fetch rows from Invited table where EventID matches the provided eventID
    await invitedTable
      .select({
        filterByFormula: `{EventID} = '${eventID}'`,
        fields: ["Amount_Invited"], // Only fetch the Amount_Invited field
      })
      .eachPage((records, fetchNextPage) => {
        // Sum up the Amount_Invited values
        records.forEach((record) => {
          const amountInvited = record.fields.Amount_Invited || 0;
          sumAmountInvited += amountInvited;
        });
        fetchNextPage();
      });

    console.log(
      `Total Amount Invited for EventID ${eventID}:`,
      sumAmountInvited
    );

    // Find the event record in the Events table to update
    const eventRecords = await eventsTable
      .select({
        filterByFormula: `{EventID} = '${eventID}'`,
      })
      .firstPage();

    if (eventRecords.length > 0) {
      const eventRecordId = eventRecords[0].id; // Assuming there's only one match

      // Update the TotalInvited field for the found record in Events table
      await eventsTable.update([
        {
          id: eventRecordId,
          fields: {
            TotalInvited: sumAmountInvited,
          },
        },
      ]);

      console.log(
        `TotalInvited updated to ${sumAmountInvited} for EventID: ${eventID} in Events table.`
      );
    } else {
      console.log(
        `No matching event found for EventID: ${eventID} in Events table.`
      );
    }
  } catch (error) {
    console.error("Error updating TotalInvited in Events table:", error);
    return { error };
  }
};

module.exports = { updateTotalInvitedInEventsTable };
