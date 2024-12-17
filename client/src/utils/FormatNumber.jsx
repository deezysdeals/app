import dayjs from 'dayjs';

const formatNumber = (number) => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M+`; // Millions
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}k+`; // Thousands
  } else {
    return number; // Return the number as is if less than 1000
  }
}; 

export default formatNumber; 