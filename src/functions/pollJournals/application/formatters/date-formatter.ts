import * as moment from 'moment';

export const formatDateToStartTime = (date: Date): string => {
  if (!date) {
    return '';
  }
  return moment(date).format('YYYY-MM-DDTHH:mm:ss+00:00');
};

export const extractTimeFromDateTime = (date: Date): string => {
  if (date === null) {
    return '';
  }
  return moment(date).format('HH:mm:ss');
};

export const extractDateFromDateTime = (date: Date): string => {
  if (date === null) {
    return '';
  }
  return moment(date).format('DD/MM/YYYY');
};
