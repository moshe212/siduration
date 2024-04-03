const Airtable = require("airtable");

const updateAmountSeats = async ({ eventID, tableID, amountSeats }) => {
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_API_KEY,
  });
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
  const table = base("TableOfEvent");

  try {
    // First, find the record ID(s) for the row(s) matching TableID and EventID
    const recordsToFindInTable = await table
      .select({
        filterByFormula: `AND({TableID} = '${tableID}', {EventID} = '${eventID}')`,
      })
      .firstPage();

    if (recordsToFindInTable.length > 0) {
      const recordToUpdate = recordsToFindInTable[0];
      const currentCountArrived = recordToUpdate.fields.ActualArrived || 0;
      const existAmountSeats = recordToUpdate.fields.AmountSeats || 0;

      const isFull =
        parseInt(currentCountArrived) >= parseInt(amountSeats)
          ? "true"
          : "false";
      await table.update([
        {
          id: recordToUpdate.id,
          fields: {
            IsFull: isFull,
            AmountSeats: amountSeats,
          },
        },
      ]);
    }

    console.log("Update successful:");
    return { success: true };
  } catch (error) {
    console.error("Error updating record:", error);
    return { error };
  }
};

module.exports = { updateAmountSeats };
