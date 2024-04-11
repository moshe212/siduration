const Airtable = require("airtable");

const addInvited = async ({
  InvitedID,
  FirstName,
  LastName,
  UserID,
  TableID,
  Closeness,
  Phone,
  AmountInvited,
  Notes,
  DoSendMessage,
}) => {
  const formattedPhone = parseInt(`0${Phone}`);
  console.log({ UserID });
  console.log({ formattedPhone });
  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const airtableBase = new Airtable({ apiKey: airtableApiKey }).base(
    airtableBaseId
  );

  const getEventIdForUser = async (userId) => {
    console.log("getEventIdForUser");
    console.log("userId: " + userId);
    const eventsTable = airtableBase("Events");
    const records = await eventsTable
      .select({
        filterByFormula: `{UserID} = '${userId}'`,
      })
      .firstPage();

    // Assuming the first matching record has the EventID you need
    return records.length > 0 ? records[0].fields.EventID : null;
  };

  try {
    const eventIDForInsert = await getEventIdForUser(UserID);
    console.log({ eventIDForInsert });
    const invitedTable = airtableBase("Invited");
    const airtableRowData = {
      InvitedID,
      Full_Name: `${FirstName} ${LastName}`,
      First_Name: FirstName, // Example mapping, adjust 'FirstName' as needed
      Last_Name: LastName, // Example mapping, adjust 'LastName' as needed
      EventID: eventIDForInsert, // This comes from the previous function, no need to adjust
      TableID, // Assuming direct match, adjust if your Excel column name is different
      Closeness, // Assuming direct match, adjust if needed
      Phone: formattedPhone, // Assuming direct match, adjust if needed
      Is_Arriving: "false",
      Amount_Invited: parseInt(AmountInvited), // Example conversion, adjust 'AmountInvited' as needed
      Is_Actually_Arrived: "false",
      // 'Actually_Arrived_Count': parseInt(rowData['ActuallyArrivedCount'], 10), // Example conversion, adjust 'ActuallyArrivedCount' as needed
      Notes, // Assuming direct match, adjust if needed
      MsgLang: 1,
      DoSendMessage,
      UserID, // This comes from the parameter, no need to adjust
    };

    // Filter out undefined values since Airtable API doesn't accept them
    Object.keys(airtableRowData).forEach(
      (key) => airtableRowData[key] === undefined && delete airtableRowData[key]
    );

    await invitedTable.create(airtableRowData);
    console.log("Invited have been processed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

module.exports = { addInvited };
