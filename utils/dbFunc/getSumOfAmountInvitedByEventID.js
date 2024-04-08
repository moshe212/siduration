const Airtable = require("airtable");

const getSumOfAmountInvitedByEventID = async (eventID) => {
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_API_KEY,
  });
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

  // Table name
  const invitedTable = base("Invited");

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
    return sumAmountInvited;
  } catch (error) {
    console.error("Error fetching sum of Amount_Invited:", error);
    return { error };
  }
};

module.exports = { getSumOfAmountInvitedByEventID };
