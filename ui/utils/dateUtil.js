const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const getCurrentMonth = () => MONTHS[new Date().getMonth()];

const getMonth = (time) => MONTHS[new Date(time).getMonth()];

const getNextMonthDate = (date, day) => {
    new Date().setMon
    const month = date.getMonth();
    if(month > 12) {
        date.setFullYear(date.getFullYear(), 1, day);
    } else{
        date.setMonth(month+1, day);
    }
}

export {MONTHS, getCurrentMonth, getMonth, getNextMonthDate};