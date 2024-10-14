import {DEFAULT_TYPE, UpdateType} from '../const';
import Observable from '../framework/observable.js';
import AdapterService from '../server/adapter-service.js';

export default class RoutePointsModel extends Observable {
  #routePoints = [];
  #offers = [];
  #destinations = [];
  #routePointsApiService = null;
  #isLoadingError = false;
  #routePointsAdapterService = new AdapterService();

  constructor({routePointsApiService}) {
    super();
    this.#routePointsApiService = routePointsApiService;
  }

  get routePoints() {
    return this.#routePoints;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  get error() {
    return this.#isLoadingError;
  }

  async init() {
    try {
      const routePoints = await this.#routePointsApiService.routePoints;
      this.#offers = await this.#routePointsApiService.offers;
      this.#destinations = await this.#routePointsApiService.destinations;
      this.#routePoints = routePoints.map(this.#routePointsAdapterService.adaptToClient);
    } catch(err) {
      this.#routePoints = [];
      this.#offers = [];
      this.#destinations = [];
      this.#isLoadingError = true;
    }
    this._notify(UpdateType.INIT);
  }

  getDestinationsById(id){
    const allDestinations = this.destinations;
    return allDestinations.find((item)=>item.id === id);
  }

  getOffersByType(type = DEFAULT_TYPE){
    const allOffers = this.offers;
    return allOffers.find((item)=>item.type === type);
  }

  getOffersById(type, offersId){
    const offersType = this.getOffersByType(type.toLowerCase());
    return offersType.offers.filter((item)=>offersId.includes(item.id));
  }

  async updateRoutePoint(updateType, update) {
    const index = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#routePointsApiService.updateRoutePoints(update);
      const updatedPoint = this.#routePointsAdapterService.adaptToClient(response);
      this.#routePoints = [
        ...this.#routePoints.slice(0, index),
        updatedPoint,
        ...this.#routePoints.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addRoutePoint(updateType, update) {
    try {
      const response = await this.#routePointsApiService.addRoutePoint(update);
      const newPoint = this.#routePointsAdapterService.adaptToClient(response);
      this.#routePoints = [
        newPoint,
        ...this.#routePoints,
      ];

      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async deleteRoutePoint(updateType, update) {
    const index = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    try {
      await this.#routePointsApiService.deleteRoutePoint(update);
      this.#routePoints = [
        ...this.#routePoints.slice(0, index),
        ...this.#routePoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }
}
