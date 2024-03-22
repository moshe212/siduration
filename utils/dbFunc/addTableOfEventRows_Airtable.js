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

  // Assuming 'TableOfEvent' is your table name
  const table = base("TableOfEvent");

  // Create an array of objects to insert
  let rowsToInsert = Array.from({ length: TableCount }, () => ({
    fields: {
      EventID, // Make sure 'EventID' matches the field name in your Airtable table
      // Add any other fields here
    },
  }));

  // Airtable API call to insert records
  try {
    const records = await table.create(rowsToInsert);
    console.log(records);
    return { data: records };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

module.exports = { addTableOfEventRows_Airtable };
