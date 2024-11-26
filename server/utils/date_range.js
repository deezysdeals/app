import { parseISO, startOfDay, endOfDay, subDays, 
        startOfMonth, endOfMonth, addMonths, subMonths, 
        startOfYear, endOfYear, addYears, subYears } from 'date-fns'; 

// Date Range Manipulation Functions

/**
 * Get the date range for the last week.
 * @returns {Object} An object containing weekStart and weekEnd.
 */
const getYesterdayDateRange = () => {
    const yesterdayStart = startOfDay(subDays(new Date(), 1))?.toISOString(); // Start of yesterday
    const yesterdayEnd = endOfDay(subDays(new Date(), 1))?.toISOString(); // End of yesterday
    return { yesterdayStart, yesterdayEnd };
};

/**
 * Get the date range for the last week.
 * @returns {Object} An object containing weekStart and weekEnd.
 */
const getTodayDateRange = () => {
    const todayStart = startOfDay(new Date())?.toISOString(); // Start of today
    const todayEnd = endOfDay(new Date())?.toISOString(); // End of today
    return { todayStart, todayEnd };
};

/**
 * Get the date range for the last week.
 * @returns {Object} An object containing weekStart and weekEnd.
 */
const getPreviousWeekDateRange = () => {
    const lastWeekStart = startOfDay(subDays(new Date(), 13))?.toISOString(); // Start of the week (7 - 14 days ago)
    const lastWeekEnd = endOfDay(subDays(new Date(), 7))?.toISOString(); // End of today
    return { lastWeekStart, lastWeekEnd };
};

/**
 * Get the date range for this week.
 * @returns {Object} An object containing weekStart and weekEnd.
 */
const getCurrentWeekDateRange = () => {
    const weekStart = startOfDay(subDays(new Date(), 6))?.toISOString(); // Start of the week (7 days ago)
    const weekEnd = endOfDay(new Date())?.toISOString(); // End of today
    return { weekStart, weekEnd };
};

/**
 * Get the date range for the previous month.
 * @returns {Object} An object containing lastMonthStart and lastMonthEnd.
 */
const getPreviousMonthDateRange = () => {
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1))?.toISOString(); // Start of the previous month
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1))?.toISOString(); // End of the previous month
    return { lastMonthStart, lastMonthEnd };
};

/**
 * Get the date range for the current month.
 * @returns {Object} An object containing monthStart and monthEnd.
 */
const getCurrentMonthDateRange = () => {
    const monthStart = startOfMonth(new Date())?.toISOString(); // Start of the current month
    const monthEnd = endOfMonth(new Date())?.toISOString(); // End of the current month
    return { monthStart, monthEnd };
};

/**
 * Get the date range for the current year.
 * @returns {Object} An object containing yearStart and yearEnd.
 */
const getPreviousYearDateRange = () => {
    const lastYearStart = startOfYear(subYears(new Date(), 1))?.toISOString(); // Start of the current year
    const lastYearEnd = endOfYear(subYears(new Date(), 1))?.toISOString(); // End of the current year
    return { lastYearStart, lastYearEnd };
};

/**
 * Get the date range for the current year.
 * @returns {Object} An object containing yearStart and yearEnd.
 */
const getCurrentYearDateRange = () => {
    const yearStart = startOfYear(new Date())?.toISOString(); // Start of the current year
    const yearEnd = endOfYear(new Date())?.toISOString(); // End of the current year
    return { yearStart, yearEnd };
};



export {
    getYesterdayDateRange, 
    getTodayDateRange, 
    getPreviousWeekDateRange, 
    getCurrentWeekDateRange, 
    getPreviousMonthDateRange,
    getCurrentMonthDateRange, 
    getPreviousYearDateRange, 
    getCurrentYearDateRange
};
