import AbstractView from '../framework/view/abstract-view.js';
import { capitalizeText} from '../utils/common.js';
import {humanizeRoutePointDate, calculateDiffTime} from '../utils/date-format.js';
import {DATE_FORMAT, TIME_FORMAT} from '../const';

const createRoutePointTemplate = (routePoint, offers, destination)=> {
  const { basePrice, type, isFavorite, dateFrom, dateTo } = routePoint;
  const typeName = capitalizeText(type);
  const favoriteClassName = isFavorite ? ' event__favorite-btn--active' : '';
  const createOfferItemTemplate = (offerItem) => `
    <li class="event__offer">
      <span class="event__offer-title">${offerItem.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offerItem.price}</span>
    </li>
  `;
  const datePoint = humanizeRoutePointDate(dateFrom, DATE_FORMAT);
  const createOffersTemplate = offers.map((offerItem)=>createOfferItemTemplate(offerItem)).join('');
  return `(
            <li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">${datePoint}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${typeName} ${destination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom}">${humanizeRoutePointDate(dateFrom, TIME_FORMAT)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo}">${humanizeRoutePointDate(dateTo, TIME_FORMAT)}</time>
                  </p>
                  <p class="event__duration">${calculateDiffTime(dateFrom,dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${createOffersTemplate}
                </ul>
                <button class="event__favorite-btn${favoriteClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>
  )`;
};
export default class RoutePointView extends AbstractView {
  #routePoint = null;
  #offers = [];
  #destination = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ routePoint, offers, destination, onEditClick, onFavoriteClick}) {
    super();
    this.#routePoint = routePoint;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editButtonClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createRoutePointTemplate(this.#routePoint, this.#offers, this.#destination);
  }

  #editButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
