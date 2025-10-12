export const convertDdMmYyyyToDate = (dateString = "01/01/00") => {
  // Split the string into day, month, and year parts
  const parts = dateString.split("/");

  // Ensure there are three parts (day, month, year)
  if (parts.length !== 3) {
    throw new Error("Invalid date string format. Expected dd/mm/yyyy.");
  }

  // Extract day, month, and year, converting them to numbers
  const day = parseInt(parts[0], 10);
  // Month in JavaScript Date object is 0-indexed (0 for January, 11 for December)
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  // Create a new Date object
  // The Date constructor takes year, month (0-indexed), and day
  return new Date(year, month, day);
};
