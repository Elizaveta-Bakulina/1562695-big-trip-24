import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

function humanizeRoutePointDate(routePointDate, FORMAT_TO_DATE) {
  return routePointDate ? dayjs(routePointDate).format(FORMAT_TO_DATE) : '';
}

function calculateDiffTime(routePointDateStart, routePointDateEnd) {
  if (routePointDateStart && routePointDateEnd) {
    const dateStart = dayjs(routePointDateStart);
    const dateEnd = dayjs(routePointDateEnd);
    const durationInUnits = dayjs.duration(dateEnd.diff(dateStart));
    const { $d } = durationInUnits;
    if ($d.months > 0) {
      const monthsInMil = dayjs.duration($d.months, 'month');
      $d.days += dayjs.duration(monthsInMil.$ms).asDays();
    }
    if ($d.years > 0) {
      const yearsInMilliseconds = dayjs.duration($d.years, 'year');
      $d.days += dayjs.duration(yearsInMilliseconds.$ms).asDays();
    }
    if ($d.days > 0) {
      return durationInUnits.format('DD[D] HH[H] mm[M]');
    }
    if ($d.hours > 0) {
      return durationInUnits.format('HH[H] mm[M]');
    }
    return durationInUnits.format('mm[M]');
  }
  return '';
}

function isFutureEvent(dateToCheck) {
  return dateToCheck && dayjs(dateToCheck).isAfter(dayjs(new Date(), 'D'));
}

function isPastEvent(dateToCheck) {
  return dateToCheck && dayjs(dateToCheck).isBefore(dayjs(new Date(), 'D'));
}

function isTodayEvent(dateToCheckStart, dateToCheckEnd) {
  return dateToCheckStart && dateToCheckEnd && dayjs(dateToCheckStart).isSameOrBefore(dayjs(new Date(), 'D')) && dayjs(dateToCheckEnd).isSameOrAfter(dayjs(new Date(), 'D'));
}

function isDatesSame(dateToCheck1, dateToCheck2){
  return (dateToCheck1 === null && dateToCheck2 === null) || dayjs(dateToCheck1).isSame(dateToCheck2, 'D');
}

export { humanizeRoutePointDate, calculateDiffTime, isFutureEvent, isPastEvent, isTodayEvent, isDatesSame };
