const { sendRemindMessage } = require("./sendRemindMessage");
const { sendInviteMessage } = require("./sendInviteMessage");
const { sendThanksMessage } = require("./sendThanksMessage");
const { extractDateAndHour } = require("./extractDateAndHour");
const { sendTestMessage } = require("./sendTestMessage");
const {
  processMessageAndUpdateStatus,
} = require("./processMessageAndUpdateStatusת");

const waMessageFunc = {
  sendRemindMessage,
  sendInviteMessage,
  sendThanksMessage,
  extractDateAndHour,
  sendTestMessage,
  processMessageAndUpdateStatus,
};

module.exports = { waMessageFunc };
