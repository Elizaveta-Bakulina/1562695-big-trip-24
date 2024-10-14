import PointEditFormView from '../view/point-edit-form-view.js';
import { RenderPosition, remove, render } from '../framework/render.js';
import { BlankPoint, UpdateType, UserAction } from '../const.js';

export default class NewRoutePointPresenter {
  #routePointListComponent = null;
  #routePointsModel = null;
  #routePoint = BlankPoint;
  #handleRoutePointChange = null;
  #handleDestroy = null;
  #handleReset = null;
  #editRoutePointComponent = null;

  constructor({routePointListComponent, routePointsModel, onRoutePointChange, onDestroy, onReset}) {
    this.#routePointListComponent = routePointListComponent;
    this.#routePointsModel = routePointsModel;
    this.#handleRoutePointChange = onRoutePointChange;
    this.#handleDestroy = onDestroy;
    this.#handleReset = onReset;
  }

  init() {
    if (this.#editRoutePointComponent !== null) {
      return;
    }
    this.#editRoutePointComponent = new PointEditFormView({
      routePoint: this.#routePoint,
      typeOffers: this.#routePointsModel.getOffersByType(),
      destinationRoutePoint: this.#routePointsModel.getDestinationsById(this.#routePoint.destination),
      allDestinations: this.#routePointsModel.destinations,
      allOffers: this.#routePointsModel.offers,
      onFormSubmit: this.#handleFormSubmit,
      onEditRollUp: this.#handleCancelClick,
      onDeleteClick: this.#handleCancelClick,
    });

    render(this.#editRoutePointComponent, this.#routePointListComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editRoutePointComponent === null) {
      return;
    }

    this.#handleDestroy();
    this.#handleReset();

    remove(this.#editRoutePointComponent);
    this.#editRoutePointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#editRoutePointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editRoutePointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#editRoutePointComponent.shake(resetFormState);
  }

  #handleFormSubmit = (routePoint) => {
    this.#handleRoutePointChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      routePoint,
    );
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
