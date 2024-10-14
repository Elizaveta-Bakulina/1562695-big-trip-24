import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { capitalizeText } from '../utils/common.js';
import {humanizeRoutePointDate} from '../utils/date-format.js';
import { TYPES, BlankPoint, FULL_DATE_FORMAT, ValidationStyle } from '../const';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';

const createPointEditFormTemplate = (state, allDestinations) => {
  const { id, basePrice, type, dateFrom, dateTo, offers, typeOffers, destination, isDisabled, isSaving, isDeleting } = state;
  const typeName = capitalizeText(type);
  const startTime = humanizeRoutePointDate(dateFrom, FULL_DATE_FORMAT);
  const endTime = humanizeRoutePointDate(dateTo, FULL_DATE_FORMAT);
  const roitePointDestination = allDestinations.find((item) => item.id === destination);
  // const { name, description, pictures } = roitePointDestination;
  const createTypeItemTemplate = (typeItem, isCheckedTypeItem) =>
    `
      <div class="event__type-item">
        <input id="event-type-${typeItem.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeItem.toLowerCase()}" ${isCheckedTypeItem ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${typeItem.toLowerCase()}" for="event-type-${typeItem.toLowerCase()}-1">${typeItem}</label>
      </div>
    `;

  const setButtonName = () => {
    if (!id) {
      return 'Cancel';
    }
    return isDeleting ? 'Deleting...' : 'Delete';
  };

  const createOfferItemTemplate = (offerItem, isCheckedOfferItem) =>
    `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="event-offer-${offerItem.id}-1" type="checkbox" name="event-offer-${type.toLowerCase()}" data-offer-id="${offerItem.id}" ${isCheckedOfferItem ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offerItem.id}-1">
          <span class="event__offer-title">${offerItem.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offerItem.price}</span>
        </label>
      </div>
    `;

  const createTypeListTemplate = TYPES.map((typeItem) => {
    const isCheckedTypeItem = typeItem === type;
    return createTypeItemTemplate(typeItem, isCheckedTypeItem);
  }).join('');

  const createAllDestinationsTemplate = allDestinations.map((desctinationItem) => `<option value="${desctinationItem.name}"></option>`).join('');

  const createPhotoesTemplate = (roitePointDestination && roitePointDestination.pictures ? roitePointDestination.pictures.map((pictureItem) => `<img class="event__photo" src="${pictureItem.src}" alt="Event photo">`).join('') : '');

  const createAllOffersTemplate = typeOffers.offers.map((offerItem) => {
    const isCheckedOfferItem = offers.includes(offerItem.id);
    return createOfferItemTemplate(offerItem, isCheckedOfferItem);
  }).join('');

  const createSectionOffers = typeOffers && typeOffers.offers.length > 0 ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createAllOffersTemplate}
      </div>
    </section>` : '';


  const createSecionDestination = roitePointDestination && roitePointDestination.description !== '' ? `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${roitePointDestination.description}</p>
    ${roitePointDestination.pictures.length > 0 ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
         ${createPhotoesTemplate}
        </div>
      </div>` : ''}

  </section>` : '';

  return `(<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${createTypeListTemplate}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${typeName}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${roitePointDestination !== undefined ? he.encode(roitePointDestination.name) : ''}" list="destination-list-1" required ${isDisabled ? 'disabled' : ''}>
                    <datalist id="destination-list-1">
                      ${createAllDestinationsTemplate}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}" ${isDisabled ? 'disabled' : ''}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}" ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaving ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
                  <button class="event__reset-btn" type="reset" ${isDeleting ? 'disabled' : ''}>${setButtonName()}</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  ${createSectionOffers}
                  ${createSecionDestination}
                </section>
              </form></li>
  )`;
};

export default class PointEditFormView extends AbstractStatefulView{
  #allDestinations = [];
  #allOffers = [];

  #handleFormSubmit = null;
  #handleEditRollUp = null;
  #initialRoutePoint = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #handleDeleteClick = null;

  constructor({ routePoint = BlankPoint, destinationRoutePoint = {}, typeOffers, allDestinations, allOffers, onFormSubmit, onEditRollUp, onDeleteClick}) {
    super();
    this.#initialRoutePoint = routePoint;
    this._setState(PointEditFormView.parseRoutePointToState(routePoint, destinationRoutePoint.id, typeOffers));
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditRollUp = onEditRollUp;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }


  get template() {
    return createPointEditFormTemplate(this._state, this.#allDestinations);
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpButtonClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeListChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerSelectHandler);
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  removeElement() {
    super.removeElement();
    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  reset() {
    this.updateElement({
      ...this.#initialRoutePoint,
      typeOffers: this.#allOffers.find((offer) => offer.type === this.#initialRoutePoint.type),
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    if (this._state.dateFrom === null) {
      this.element.querySelector('#event-start-time-1').setAttribute('style', ValidationStyle.FOR_BORDER);
      return;
    }
    if (this._state.dateTo === null) {
      this.element.querySelector('#event-end-time-1').setAttribute('style', ValidationStyle.FOR_BORDER);
      return;
    }
    if (this._state.dateTo < this._state.dateFrom) {
      this.element.querySelector('#event-end-time-1').setAttribute('style', ValidationStyle.FOR_TEXT_COLOR);
      return;
    }
    if(!this._state.destination) {
      this.element.querySelector('#event-destination-1').setAttribute('style', ValidationStyle.FOR_BORDER);
      return;
    }
    this.#handleFormSubmit(PointEditFormView.parseStateToRoutePoint(this._state));
  };

  #rollUpButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditRollUp(PointEditFormView.parseStateToRoutePoint(this.#initialRoutePoint));
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#setDatepickerEnd();
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });

  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const targetDestination = evt.target.value;
    const newDestination = this.#allDestinations.find((destination) => destination.name === targetDestination);
    if(!newDestination) {
      this.element.querySelector('#event-destination-1').setAttribute('style', ValidationStyle.FOR_BORDER);
      return;
    }
    this.updateElement({
      destination: newDestination.id,
    });
  };

  #typeListChangeHandler = (evt) => {
    evt.preventDefault();
    const targetType = evt.target.value;
    const typeOffers = this.#allOffers.find((item) => item.type === targetType);
    this.updateElement({
      type: targetType,
      typeOffers: typeOffers,
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    const newPrice = evt.target.value;
    this._setState({
      basePrice: parseInt(newPrice, 10)
    });
  };

  #setDatepickerStart() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      }
    );
  }

  #setDatepickerEnd() {
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        minDate: this._state.dateFrom,
      }
    );
  }

  #offerSelectHandler = () => {
    const checkedOffersElement = this.element.querySelectorAll('.event__offer-checkbox:checked');
    const checkedOffersById = Array.from(checkedOffersElement).map((item) => item.dataset.offerId);
    this._setState({
      offers: checkedOffersById
    });
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditFormView.parseStateToRoutePoint(this.#initialRoutePoint));
  };

  static parseRoutePointToState(routePoint, destinationRoutePoint, typeOffers) {
    return {
      ...routePoint,
      destination: destinationRoutePoint,
      typeOffers,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToRoutePoint(state) {
    const routePoint = {...state};
    if (routePoint.typeOffers) {
      delete routePoint.typeOffers;
    }
    delete routePoint.isDisabled;
    delete routePoint.isSaving;
    delete routePoint.isDeleting;
    return routePoint;
  }
}
