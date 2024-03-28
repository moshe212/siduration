const extractDateAndHour = async ({ isoDateString }) => {
  // Create a Date object from the ISO string
  const date = new Date(isoDateString);

  // Extract the date components
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Pad with leading zero
  const day = date.getUTCDate().toString().padStart(2, "0"); // Pad with leading zero
  const dateString = `${year}-${month}-${day}`;

  // Extract the hour component
  const hour = date.getUTCHours().toString().padStart(2, "0"); // Pad with leading zero

  // Return the date and hour as an object
  return {
    date: dateString,
    hour: hour,
  };
};

module.exports = { extractDateAndHour };
