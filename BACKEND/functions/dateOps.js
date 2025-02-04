function getCurrentDateString() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
};

function calculateDateDifference(dateString1, dateString2) {
    const parseDate = (date) => {
        const [day, month, year] = String(date).split('/',).map(Number);
        return new Date(year, month - 1, day); // Month is zero-indexed
    };

    const date1 = parseDate(dateString1);
    const date2 = parseDate(dateString2);
    
    const differenceInTime = Math.abs(date2.getTime() - date1.getTime());
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    
    return differenceInDays;
};

module.exports = {getCurrentDateString, calculateDateDifference}