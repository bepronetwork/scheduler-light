import {leftPad} from './math';

const nameCurrentDate = () => {
    let date = new Date();
    const day   = date.getDate();
    const month = date.getMonth()+1;
    const year  = date.getFullYear();
    date = `${leftPad(day, 2)}${leftPad(month, 2)}${year}`;
    return date;
  };


export {
    nameCurrentDate
};