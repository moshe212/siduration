const { sendRemindMessage } = require("./sendRemindMessage");
const { sendInviteMessage } = require("./sendInviteMessage");
const { sendThanksMessage } = require("./sendThanksMessage");
const { extractDateAndHour } = require("./extractDateAndHour");

const waMessageFunc = {
  sendRemindMessage,
  sendInviteMessage,
  sendThanksMessage,
  extractDateAndHour,
};

module.exports = { waMessageFunc };
