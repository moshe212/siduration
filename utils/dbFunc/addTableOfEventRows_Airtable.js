const Airtable = require("airtable");

const addTableOfEventRows_Airtable = async ({
  UserID,
  EventID,
  TableCount,
}) => {
  // Initialize Airtable
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_API_KEY,
  });
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

  // Table names
  const tableOfEvent = base("TableOfEvent");
  const eventsTable = base("Events");

  try {
    // Check if there are any existing rows for the given EventID in TableOfEvent
    let existingRowCount = 0;
    await tableOfEvent
      .select({
        filterByFormula: `{EventID} = '${EventID}'`,
      })
      .eachPage((records, fetchNextPage) => {
        existingRowCount += records.length;
        fetchNextPage();
      });

    // Proceed with insertion only if there are no existing rows for the EventID
    if (existingRowCount === 0) {
      // Create an array of objects to insert
      let rowsToInsert = Array.from({ length: TableCount }, (_, index) => ({
        fields: {
          EventID,
          TableID: index + 1,
        },
      }));

      // Insert records into TableOfEvent
      const records = await tableOfEvent.create(rowsToInsert);
      console.log("New rows added to TableOfEvent:", records);

      // Find the correct record ID in the Events table associated with EventID
      const eventRecords = await eventsTable
        .select({
          filterByFormula: `{EventID} = '${EventID}'`,
        })
        .firstPage();

      if (eventRecords.length > 0) {
        const eventRecordId = eventRecords[0].id; // Assuming there's only one match

        // Update the IsTableAdded field for the found record in Events table
        await eventsTable.update([
          {
            id: eventRecordId,
            fields: {
              IsTableAdded: true,
            },
          },
        ]);

        console.log(
          `IsTableAdded set to true for EventID: ${EventID} in Events table.`
        );
      } else {
        console.log(
          `No matching event found for EventID: ${EventID} in Events table.`
        );
      }

      return { data: records };
    } else {
      console.log(
        "No new rows added to TableOfEvent. Existing rows with the EventID already exist."
      );
      return {
        message:
          "No new rows added to TableOfEvent because existing rows with the EventID already exist.",
      };
    }
  } catch (error) {
    console.error("Error in operation:", error);
    return { error };
  }
};

module.exports = { addTableOfEventRows_Airtable };
