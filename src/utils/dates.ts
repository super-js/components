import * as moment from "moment";

export const dateToString = (date: any) => moment(date).format('DD/MM/YYYY');
export const dateTimeToString = (date: any) => moment(date).format('DD/MM/YYYY H:mm');
export const isDate = (date: any) => moment.isDate(date)