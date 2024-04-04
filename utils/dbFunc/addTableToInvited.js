const Airtable = require("airtable");

const addTableToInvited = async ({ eventID, invitedID, tableID }) => {
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_API_KEY,
  });
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

  try {
    // Access the Invited table
    const invitedTable = base("Invited");
    // 1. Update the TableID column for the matching InvitedID
    const invitedRecords = await invitedTable
      .select({
        filterByFormula: `{InvitedID} = '${invitedID}'`,
      })
      .firstPage();

    let actualArrivedCount = 0;
    if (invitedRecords.length > 0) {
      const invitedRecord = invitedRecords[0];
      await invitedTable.update([
        {
          id: invitedRecord.id,
          fields: {
            TableID: tableID, // Update TableID column
          },
        },
      ]);

      // 2. Get the Actual_Arrived_Count value
      actualArrivedCount = invitedRecord.fields.Actual_Arrived_Count || 0;
    }

    // Access the TableOfEvent table
    const tableOfEvent = base("TableOfEvent");
    // 3. Update the ActualArrived column in the TableOfEvent table
    const eventRecords = await tableOfEvent
      .select({
        filterByFormula: `AND({TableID} = '${tableID}', {EventID} = '${eventID}')`,
      })
      .firstPage();

    if (eventRecords.length > 0) {
      const eventRecord = eventRecords[0];
      const currentActualArrived = eventRecord.fields.ActualArrived || 0;
      const updatedActualArrived = currentActualArrived + actualArrivedCount;

      // 4. Calculate TotalActualArrived and determine if the table is full
      const amountSeats = eventRecord.fields.AmountSeats || 0;
      const isFull = updatedActualArrived >= amountSeats;

      // 5. Update the ActualArrived and IsFull columns in the TableOfEvent table
      await tableOfEvent.update([
        {
          id: eventRecord.id,
          fields: {
            ActualArrived: updatedActualArrived,
            IsFull: isFull.toString(), // Airtable fields may require a string value
          },
        },
      ]);
    }

    console.log("Update successful");
    return { success: true };
  } catch (error) {
    console.error("Error updating records:", error);
    return { error };
  }
};

module.exports = { addTableToInvited };
