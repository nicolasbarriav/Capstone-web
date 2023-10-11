import { isSunday } from 'date-fns';

export function getNextValidDate(date: Date): string {
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + 1);
  // If nextDate is Sunday, add one more day
  if (isSunday(nextDate)) {
    nextDate.setDate(nextDate.getDate() + 1);
  }

  return nextDate.toISOString().split('T')[0] || '';
}
