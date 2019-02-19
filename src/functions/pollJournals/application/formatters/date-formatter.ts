import * as moment from 'moment';

export const formatDateToStartTime = (date: Date): string => {
  if (!date) {
    return '';
  }
  return moment(date).format('YYYY-MM-DDTHH:mm:ss+00:00');
};
