const Airtable = require("airtable");
const xlsx = require("xlsx");
// const fetch = require("node-fetch");
const axios = require("axios");

const createInvitedFromFile = async ({
  userId,
  excelFileUrl,
  eventIdFromAdalo,
}) => {
  console.log({ userId });
  console.log({ eventIdFromAdalo });
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

  const getUserID = async (eventIdFromAdalo) => {
    console.log("getUserID");
    console.log("eventId: " + eventIdFromAdalo);
    const eventsTable = airtableBase("Events");
    const records = await eventsTable
      .select({
        filterByFormula: `{EventID} = '${eventIdFromAdalo}'`,
      })
      .firstPage();

    // Assuming the first matching record has the EventID you need
    return records.length > 0 ? records[0].fields.UserID : null;
  };

  const addRowToInvitedTable = async (rowData, eventId, userId, index) => {
    console.log("addRowToInvitedTable");
    const userIDForInsert =
      userId !== 0 ? userId : await getUserID(eventIdFromAdalo);
    console.log({ userIDForInsert });
    const invitedTable = airtableBase("Invited");
    const airtableRowData = {
      InvitedID: index,
      Full_Name: rowData["Full_Name"],
      First_Name: rowData["FirstName"], // Example mapping, adjust 'FirstName' as needed
      Last_Name: rowData["LastName"], // Example mapping, adjust 'LastName' as needed
      EventID: eventId, // This comes from the previous function, no need to adjust
      TableID: rowData["TableID"], // Assuming direct match, adjust if your Excel column name is different
      Closeness: rowData["Closeness"], // Assuming direct match, adjust if needed
      Phone: rowData["Phone"], // Assuming direct match, adjust if needed
      Is_Arriving: "false",
      Amount_Invited: parseInt(rowData["AmountInvited"], 10), // Example conversion, adjust 'AmountInvited' as needed
      Is_Actually_Arrived: "false",
      // 'Actually_Arrived_Count': parseInt(rowData['ActuallyArrivedCount'], 10), // Example conversion, adjust 'ActuallyArrivedCount' as needed
      Notes: rowData["Notes"], // Assuming direct match, adjust if needed
      MsgLang: 1,
      DoSendMessage: rowData["DoSendMessage"],
      UserID: parseInt(userIDForInsert), // This comes from the parameter, no need to adjust
    };

    // Filter out undefined values since Airtable API doesn't accept them
    Object.keys(airtableRowData).forEach(
      (key) => airtableRowData[key] === undefined && delete airtableRowData[key]
    );

    await invitedTable.create(airtableRowData);
  };

  const processExcelFile = async (url, eventId, userId) => {
    console.log("processExcelFile");
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const arrayBuffer = response.data;
    const workbook = xlsx.read(new Uint8Array(arrayBuffer), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    let index = 1;
    for (const row of rows) {
      // Assuming row structure matches the Airtable "invited" table structure
      // You might need to adjust the mapping based on your Excel file structure
      await addRowToInvitedTable(row, eventId, userId, index++);
    }
  };

  const updateIsFileUploaded = async (eventId) => {
    const eventsTable = airtableBase("Events");
    // Find the correct record ID in the Events table associated with EventID
    const eventRecords = await eventsTable
      .select({
        filterByFormula: `{EventID} = '${eventId}'`,
      })
      .firstPage();

    if (eventRecords.length > 0) {
      const eventRecordId = eventRecords[0].id; // Assuming there's only one match

      // Update the IsTableAdded field for the found record in Events table
      await eventsTable.update([
        {
          id: eventRecordId,
          fields: {
            IsFileUploaded: "true",
          },
        },
      ]);

      console.log(`TotalArrived set for EventID: ${eventId} in Events table.`);
    } else {
      console.log(
        `No matching event found for EventID: ${eventId} in Events table.`
      );
    }
  };

  const addUserInvitesFromExcel = async (userId, excelFileUrl) => {
    console.log("addUserInvitesFromExcel");
    try {
      const eventId =
        eventIdFromAdalo !== 0
          ? eventIdFromAdalo
          : await getEventIdForUser(userId);
      if (!eventId) {
        console.error("EventID not found for the given UserID");
        return;
      }

      await processExcelFile(excelFileUrl, eventId, userId);
      await updateIsFileUploaded(eventId);
      console.log("All invites have been processed successfully.");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Example usage
  // const userId = 'yourUserIdHere';
  // const excelFileUrl = 'https://example.com/path/to/your/excel/file.xlsx';
  addUserInvitesFromExcel(userId, excelFileUrl);
};

module.exports = { createInvitedFromFile };
