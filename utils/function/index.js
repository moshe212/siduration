const { sendRemindMessage } = require("./sendRemindMessage");
const { sendInviteMessage } = require("./sendInviteMessage");
const { sendThanksMessage } = require("./sendThanksMessage");
const { extractDateAndHour } = require("./extractDateAndHour");
const { sendTestMessage } = require("./sendTestMessage");

const waMessageFunc = {
  sendRemindMessage,
  sendInviteMessage,
  sendThanksMessage,
  extractDateAndHour,
  sendTestMessage,
};

module.exports = { waMessageFunc };
