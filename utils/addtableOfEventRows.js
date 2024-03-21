const { createClient } = require("@supabase/supabase-js");

const addTableOfEventRows = async ({ UserID, TableID, EventID }) => {
  const supabaseUrl = "https://eavydmhhilwqdcspqhlj.supabase.co";
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const tableOfEventRow = {
    UserID,
    TableID,
    EventID,
  };

  const { data, error } = await supabase
    .from("TableOfEvent")
    .insert(tableOfEventRow);

  if (error) {
    console.log(error);
    return error;
  } else {
    console.log(data);
    return data;
  }
};

module.exports = { addTableOfEventRows };
