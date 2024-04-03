const Airtable = require("airtable");

const deleteTable = async ({ eventID, tableID }) => {
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_API_KEY,
  });
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

  try {
    // Access the TableOfEvent table
    const tableOfEvent = base("TableOfEvent");
    // Find and delete the record in TableOfEvent
    const recordsToDelete = await tableOfEvent
      .select({
        filterByFormula: `AND({TableID} = '${tableID}', {EventID} = '${eventID}')`,
      })
      .firstPage();

    for (const record of recordsToDelete) {
      await tableOfEvent.destroy(record.id);
    }
    console.log("Record(s) deleted successfully from TableOfEvent.");

    // Access the Events table
    const eventsTable = base("Events");
    // Find the record to update in Events
    const recordsToUpdate = await eventsTable
      .select({
        filterByFormula: `AND({TableID} = '${tableID}', {EventID} = '${eventID}')`,
      })
      .firstPage();

    for (const record of recordsToUpdate) {
      await eventsTable.update([
        {
          id: record.id,
          fields: {
            TableID: "", // Setting TableID to empty
          },
        },
      ]);
    }
    console.log("Record(s) updated successfully in Events table.");

    return { success: true };
  } catch (error) {
    console.error("Error modifying records:", error);
    return { error };
  }
};

module.exports = { deleteTable };
