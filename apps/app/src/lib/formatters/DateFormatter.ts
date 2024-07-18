import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isSameYear,
} from 'date-fns';
import { es } from 'date-fns/locale';

class DateFormatter {
  formatElapsedTime(creationDate: Date) {
    const now = new Date();
    const minutes = differenceInMinutes(now, creationDate);
    const hours = differenceInHours(now, creationDate);
    const days = differenceInDays(now, creationDate);

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else if (days < 365 && isSameYear(now, creationDate)) {
      return format(creationDate, 'd MMMM', { locale: es });
    } else {
      return format(creationDate, 'dd-MM-yyyy', { locale: es });
    }
  }
}

export const dateFormatter = new DateFormatter();
