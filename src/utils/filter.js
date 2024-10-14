import {isFutureEvent, isPastEvent, isTodayEvent} from '../utils/date-format.js';
import { FilterType } from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (routePoints) => routePoints,
  [FilterType.FUTURE]: (routePoints) => routePoints.filter((routePoint)=>isFutureEvent(routePoint.dateFrom)),
  [FilterType.PRESENT]:(routePoints) => routePoints.filter((routePoint)=>isTodayEvent(routePoint.dateFrom, routePoint.dateTo)),
  [FilterType.PAST]:(routePoints) => routePoints.filter((routePoint)=>isPastEvent(routePoint.dateTo)),
};
export {filter};
