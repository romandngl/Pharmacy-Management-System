export function getDateString(date) {
    // Ensure date is a valid Date object
    const validDate = new Date(date);
    
    // Check if the resulting Date is valid
    if (isNaN(validDate.getTime())) {
      console.log("Invalid date")
      return "N/A";
      // throw new Error("Invalid date");
    }
  
    return validDate.toISOString().split('T')[0];
  }
  