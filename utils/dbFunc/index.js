const { addTableOfEventRows } = require("./addTableOfEventRows");
const { updateInvitedArrivedCount } = require("./updateInvitedArrivedCount");
const { createInvitedFromFile } = require("./createInvitedFromFile");

const {
  addTableOfEventRows_Airtable,
} = require("./addTableOfEventRows_Airtable");

const dbFunc = {
  addTableOfEventRows,
  addTableOfEventRows_Airtable,
  updateInvitedArrivedCount,
  createInvitedFromFile,
};

module.exports = { dbFunc };
