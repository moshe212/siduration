const Airtable = require("airtable");

const updateInvitedArrivedCount = async ({
  TableID,
  EventID,
  ActualArrivedCount,
}) => {
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_API_KEY,
  });
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
  const table = base("TableOfEvent"); // Replace 'YourTableName' with your actual table name

  try {
    // First, find the record ID(s) for the row(s) matching TableID and EventID
    const recordsToFind = await table
      .select({
        filterByFormula: `AND({TableID} = '${TableID}', {EventID} = '${EventID}')`,
      })
      .firstPage();

    if (recordsToFind.length === 0) {
      console.log("No matching records found");
      return;
    }

    // Assuming TableID and EventID combination is unique, update the first found record
    const recordToUpdate = recordsToFind[0];
    const currentCountInvited = recordToUpdate.fields.ActualArrived || 0; // Default to 0 if undefined
    const newCountInvited = currentCountInvited + ActualArrivedCount; // Calculate the new CountInvited value
    const updateResult = await table.update([
      {
        id: recordToUpdate.id,
        fields: {
          ActualArrived: newCountInvited, // Update CountInvited field
        },
      },
    ]);

    console.log("Update successful:", updateResult);
    return { data: updateResult };
  } catch (error) {
    console.error("Error updating record:", error);
    return { error };
  }
};

module.exports = { updateInvitedArrivedCount };
