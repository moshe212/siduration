const { addTableOfEventRows } = require("./addTableOfEventRows");
const {
  addTableOfEventRows_Airtable,
} = require("./addTableOfEventRows_Airtable");

const dbFunc = { addTableOfEventRows, addTableOfEventRows_Airtable };

module.exports = { dbFunc };
