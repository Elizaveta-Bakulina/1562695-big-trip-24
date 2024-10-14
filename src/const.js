const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const CITIES = ['Amsterdam','Paris', 'London', 'Madrid', 'Lissabon', 'Rome', 'Helsinki' ];
const DESCRIPTION_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const POINT_COUNT = 3;
const MAX_COUNT_DESTINATIONS = 3;
const DEFAULT_TYPE = 'flight';
const BlankPoint = {
  type: DEFAULT_TYPE,
  basePrice: 0,
  destination: null,
  dateFrom: null,
  dateTo: null,
  isFavorite: false,
  offers:[],
};
const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const FULL_DATE_FORMAT = 'DD/MM/YY HH:mm';
const DATE_FOR_TRIP_INFO = 'D MMM';

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};
const FilterType = {
  EVERYTHING: 'Everything',
  PAST: 'Past',
  PRESENT: 'Present',
  FUTURE: 'Future',
};
const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};
const DISABLED_SORT_TYPES = [SortType.OFFERS, SortType.EVENT];
const UserAction = {
  UPDATE_POINT: 'UPDATE_ROUTE_POINT',
  ADD_POINT: 'ADD_ROUTE_POINT',
  DELETE_POINT: 'DELETE_ROUTE_POINT',
};
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};
const EmptyListText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
  LOADING: 'Loading...',
  LOADING_ERROR: 'Failed to load latest route information'
};

const ValidationStyle = {
  FOR_BORDER: 'border: 1px solid red; border-radius: 3px',
  FOR_TEXT_COLOR: 'color: red',
};
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {TYPES, CITIES, DESCRIPTION_TEXT, POINT_COUNT, DEFAULT_TYPE, BlankPoint, DATE_FORMAT, TIME_FORMAT, FULL_DATE_FORMAT, DATE_FOR_TRIP_INFO, EmptyListText, SortType, FilterType, Mode, DISABLED_SORT_TYPES, UserAction, UpdateType, ValidationStyle, TimeLimit, MAX_COUNT_DESTINATIONS};
