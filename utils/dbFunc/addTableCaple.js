const Airtable = require("airtable");

// Function to add a row to the TableOfEvent
const addTableCaple = async ({ TableID, UserID, AmountSeats }) => {
  // Initialize Airtable
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_API_KEY,
  });
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

  // Reference to the TableOfEvent table
  const tableOfEvent = base("TableOfEvent");

  try {
    // Optionally, check if a row with the same TableID and UserID already exists
    // This step is optional and depends on your application's logic

    // Prepare the row to insert
    const rowToInsert = {
      fields: {
        TableID: TableID, // Assuming TableID is a string or number
        UserID: UserID, // Assuming UserID is a string or number that references a user
        AmountSeats: AmountSeats, // Assuming AmountSeats is a number
      },
    };

    // Insert the row into TableOfEvent
    const record = await tableOfEvent.create([rowToInsert]);
    console.log("Row added to TableOfEvent:", record);

    return { data: record };
  } catch (error) {
    console.error("Error in addSeatToTableOfEvent operation:", error);
    return { error };
  }
};

module.exports = { addTableCaple };
