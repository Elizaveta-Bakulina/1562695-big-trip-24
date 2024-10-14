import { RenderPosition, remove, render } from '../framework/render.js';
import { sortByDay } from '../utils/sorting.js';
import {MAX_COUNT_DESTINATIONS} from '../const.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #routePointsModel = null;
  #sortedRoutePoints = null;
  #destinations = null;
  #destinationsName = null;
  #tripMainContainer = null;
  #tripInfoComponent = null;
  #tripDates = null;
  #cost = null;

  constructor({routePointsModel, tripMainContainer}) {
    this.#routePointsModel = routePointsModel;
    this.#tripMainContainer = tripMainContainer;
    this.#sortedRoutePoints = [...this.#routePointsModel.routePoints.sort(sortByDay)];
    this.#routePointsModel.addObserver(this.#handleModelEvent);
  }

  get destinations() {
    const allDestinations = this.#routePointsModel.destinations;
    this.#destinations = this.#sortedRoutePoints.map((point) => allDestinations.find((item) => item.id === point.destination));
    this.#destinationsName = this.#destinations.map((destination) => destination.name);
    if (this.#destinations.length > MAX_COUNT_DESTINATIONS) {
      this.#destinationsName = [
        this.#destinationsName[0],
        this.#destinationsName[this.#destinationsName.length - 1],
      ];
    } else if (this.#destinations.length === MAX_COUNT_DESTINATIONS) {
      this.#destinationsName = [
        this.#destinationsName[0],
        this.#destinationsName[1],
        this.#destinationsName[this.#destinationsName.length - 1],
      ];
    }
    return this.#destinationsName;
  }

  get dates() {
    if (this.#sortedRoutePoints.length > 2) {
      this.#tripDates = [
        this.#sortedRoutePoints[0].dateFrom,
        this.#sortedRoutePoints[this.#sortedRoutePoints.length - 1].dateTo,
      ];
    } else if (this.#sortedRoutePoints.length === 1) {
      this.#tripDates = [
        this.#sortedRoutePoints[0].dateFrom,
        this.#sortedRoutePoints[0].dateTo,
      ];
    } else if (this.#sortedRoutePoints.length === 0 || !this.#sortedRoutePoints) {
      this.#tripDates = [];
    }
    return this.#tripDates;
  }

  get cost() {
    if (this.#sortedRoutePoints) {
      const costRoutePoints = this.#sortedRoutePoints.map((point) => {
        const offersRoutePoint = this.#routePointsModel.getOffersById(point.type, point.offers);
        const priceOffers = offersRoutePoint.map((offer) => offer.price);
        const cost = priceOffers.reduce((previousValue, currentValue) => previousValue + currentValue, point.basePrice);
        return cost;
      });
      this.#cost = costRoutePoints.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    } else if (this.#sortedRoutePoints.length === 0) {
      this.#cost = null;
    }
    return this.#cost;
  }

  init() {
    if (this.#tripInfoComponent !== null) {
      return;
    }
    this.#tripInfoComponent = new TripInfoView({
      destinations: this.destinations,
      dates: this.dates,
      cost: this.cost,
    });
    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    remove(this.#tripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
