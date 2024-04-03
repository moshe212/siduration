const { addTableOfEventRows } = require("./addTableOfEventRows");
const { updateInvitedArrivedCount } = require("./updateInvitedArrivedCount");
const { createInvitedFromFile } = require("./createInvitedFromFile");
const { updateAmountSeats } = require("./updateAmountSeats");
const { deleteTable } = require("./deleteTable");

const {
  addTableOfEventRows_Airtable,
} = require("./addTableOfEventRows_Airtable");

const dbFunc = {
  addTableOfEventRows,
  addTableOfEventRows_Airtable,
  updateInvitedArrivedCount,
  createInvitedFromFile,
  updateAmountSeats,
  deleteTable,
};

module.exports = { dbFunc };
