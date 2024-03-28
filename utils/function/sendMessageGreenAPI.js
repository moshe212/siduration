const whatsAppClient = require("@green-api/whatsapp-api-client");

const sendMessageGreenAPI = async ({ message, number }) => {
  // instance manager https://console.green-api.com
  const idInstance = process.env.GREEN_INSTANCE_ID;
  const apiTokenInstance = process.env.GREEN_TOKEN_INSTANCE;

  // Send WhatsApp message
  const restAPI = whatsAppClient.restAPI({
    idInstance,
    apiTokenInstance,
  });
  try {
    const response = await restAPI.message.sendMessage(number, null, message);
    console.log(response.idMessage);
    return true;
  } catch (ex) {
    console.error(ex.response);
    return false;
  }
};

module.exports = { sendMessageGreenAPI };
