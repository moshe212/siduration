const { createClient } = require("@supabase/supabase-js");

const addTableOfEventRows = async ({ UserID, EventID, TableCount }) => {
  const supabaseUrl = "https://eavydmhhilwqdcspqhlj.supabase.co";
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Create an array of objects to insert
  const rowsToInsert = Array.from({ length: TableCount }, () => ({
    EventID, // Assuming you want to use the same EventID for all rows
    // Add any other properties here if needed
  }));

  //If rows exist do not create

  const { data, error } = await supabase
    .from("TableOfEvent")
    .insert(rowsToInsert);

  if (error) {
    console.error(error); // Changed to console.error for better error visibility
    return { error };
  } else {
    console.log(data);
    return { data };
  }
};

module.exports = { addTableOfEventRows };
