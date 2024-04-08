const Airtable = require("airtable");

const updateInvitedArrivedCount = async ({
  TableID,
  EventID,
  InvitedID,
  ActualArrivedCount,
}) => {
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_API_KEY,
  });
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
  const firstTable = base("TableOfEvent");
  const secondTable = base("Invited");
  const thirdTable = base("Events");

  try {
    // First, find the record ID(s) for the row(s) matching TableID and EventID
    const recordsToFindInFirstTable = await firstTable
      .select({
        filterByFormula: `AND({TableID} = '${TableID}', {EventID} = '${EventID}')`,
      })
      .firstPage();

    // if (recordsToFindInFirstTable.length === 0) {
    //   console.log("No matching records found in recordsToFindInFirstTable");
    //   return;
    // }

    if (recordsToFindInFirstTable.length > 0) {
      const recordToUpdate = recordsToFindInFirstTable[0];
      const currentCountArrived = recordToUpdate.fields.ActualArrived || 0;
      const amountSeats = recordToUpdate.fields.AmountSeats || 0;
      const newCountArrived =
        parseInt(currentCountArrived) + parseInt(ActualArrivedCount);
      const isFull =
        parseInt(newCountArrived) >= parseInt(amountSeats) ? "true" : "false";
      await firstTable.update([
        {
          id: recordToUpdate.id,
          fields: {
            ActualArrived: newCountArrived,
            IsFull: isFull,
          },
        },
      ]);
    }

    const recordsToFindInSecondTable = await secondTable
      .select({
        filterByFormula: `AND({InvitedID} = '${InvitedID}', {EventID} = '${EventID}')`,
      })
      .firstPage();

    // if (recordsToFindInSecondTable.length === 0) {
    //   console.log("No matching records found in recordsToFindInSecondTable");
    //   return;
    // }

    if (recordsToFindInSecondTable.length > 0) {
      const updates = recordsToFindInSecondTable.map((record) => ({
        id: record.id,
        fields: {
          Is_Actually_Arrived: "true",
          Actualy_Arrived_Count: ActualArrivedCount,
        },
      }));

      await secondTable.update(updates);
    }

    const recordsToFindInThirdTable = await thirdTable
      .select({
        filterByFormula: `{EventID} = '${EventID}'`,
      })
      .firstPage();

    if (recordsToFindInThirdTable.length > 0) {
      const recordToUpdateInThirdTable = recordsToFindInThirdTable[0];
      const currentCountArrived =
        recordToUpdateInThirdTable.fields.TotalArrived;
      const newCountArrived =
        parseInt(currentCountArrived) + parseInt(ActualArrivedCount);

      const updates = recordsToFindInThirdTable.map((record) => ({
        id: record.id,
        fields: {
          TotalArrived: newCountArrived,
        },
      }));

      await thirdTable.update(updates);
    }

    console.log("Update successful:");
    return { success: true };
  } catch (error) {
    console.error("Error updating record:", error);
    return { error };
  }
};

module.exports = { updateInvitedArrivedCount };
