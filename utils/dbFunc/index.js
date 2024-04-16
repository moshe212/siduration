const { addTableOfEventRows } = require("./addTableOfEventRows");
const { updateInvitedArrivedCount } = require("./updateInvitedArrivedCount");
const { createInvitedFromFile } = require("./createInvitedFromFile");
const { updateAmountSeats } = require("./updateAmountSeats");
const { deleteTable } = require("./deleteTable");
const { addTableToInvited } = require("./addTableToInvited");
const { updateEventMessageAndTime } = require("./updateEventMessageAndTime");
const { addInvited } = require("./addInvited");
const { addTableCaple } = require("./addTableCaple");
const { getEventDetailsByUserId } = require("./getEventDetailsByUserId");
const {
  updateTotalInvitedInEventsTable,
} = require("./updateTotalInvitedInEventsTable");

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
  addTableToInvited,
  updateEventMessageAndTime,
  updateTotalInvitedInEventsTable,
  addInvited,
  addTableCaple,
  getEventDetailsByUserId,
};

module.exports = { dbFunc };
