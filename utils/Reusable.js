exports.ConvertTime = (utcDateString) => {

  // Split the UTC date string into date and time parts
  const [datePart, timePart] = utcDateString.split("T");

  // Extract the year, month, and day components from the date part
  const [year, month, day] = datePart.split("-").map(Number);

  // Extract the hour, minute, second components from the time part
  const [hour, minute, secondWithMillisecond] = timePart
    .replace("Z", "")
    .split(":");
  const [second, millisecond] = secondWithMillisecond.split(".");

  // Convert to numbers
  const hourNum = Number(hour);
  const minuteNum = Number(minute);
  const secondNum = Number(second);
  const millisecondNum = Number(millisecond);

  // Create the UTC date object using Date.UTC() to ensure it's interpreted as UTC
  const utcDate = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      hourNum,
      minuteNum,
      secondNum,
      millisecondNum
    )
  );

  // Define the IST offset in milliseconds (5 hours 30 minutes)
  const istOffsetMilliseconds = 5.5 * 60 * 60 * 1000;

  // Apply the IST offset to the UTC date
  const istDate = new Date(utcDate.getTime() + istOffsetMilliseconds);

  // Format the adjusted date back into the original UTC format with milliseconds and 'Z'
  const adjustedDateString = `${istDate.getUTCFullYear()}-${String(
    istDate.getUTCMonth() + 1
  ).padStart(2, "0")}-${String(istDate.getUTCDate()).padStart(2, "0")}T${String(
    istDate.getUTCHours()
  ).padStart(2, "0")}:${String(istDate.getUTCMinutes()).padStart(
    2,
    "0"
  )}:${String(istDate.getUTCSeconds()).padStart(2, "0")}.${String(
    istDate.getUTCMilliseconds()
  ).padStart(3, "0")}Z`;


  // Return the adjusted time string
  return adjustedDateString;
};
