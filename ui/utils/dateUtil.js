const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const getCurrentMonth = () => MONTHS[new Date().getMonth()];

const getMonth = (time) => MONTHS[new Date(time).getMonth()];

const getNextMonthDate = (date = new Date(Date.now()), day = date.getDate()) => {
    const month = date.getMonth();
    if(month == 12) {
        date.setFullYear(date.getFullYear(), 1, day);
    } else{
        date.setMonth(month+1, day);
    }
    return date;
}

/**
 * Calculate a target date by adding or subtracting days from a given date
 * @param {Date} startDate - The starting date
 * @param {number} days - Number of days to add (positive) or subtract (negative)
 * @returns {Date} The calculated target date
 */
const calculateDate = (startDate, days) => {
    const result = new Date(startDate);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Format a date as a string in the format "MMMM DD, YYYY"
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
const formatDate = (date) => {
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export {MONTHS, getCurrentMonth, getMonth, getNextMonthDate, calculateDate, formatDate};