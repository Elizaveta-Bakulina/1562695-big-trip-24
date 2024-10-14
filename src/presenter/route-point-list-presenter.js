import SortView from '../view/sort-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import {FilterType, SortType, UpdateType, UserAction, EmptyListText, TimeLimit} from '../const.js';
import RoutePointPresenter from './route-point-presenter.js';
import NewRoutePointPresenter from './new-route-point-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';
import {sortByPrice, sortByTime, sortByDay} from '../utils/sorting.js';
import { render, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { filter } from '../utils/filter.js';

export default class RoutePointListPresenter {
  #routePointsListContainer = null;
  #tripMainContainer = null;
  #newPointButton = null;

  #routePointsModel = null;
  #filterModel = null;

  #sorting = null;
  #emptyList = null;
  #loadingComponent = null;
  #loadingErrorComponent = null;
  #newRoutePointPresenter = null;
  #tripInfoPresenter = null;

  #routePointsPresenters = new Map();
  #routePointListComponent = new RoutePointListView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #loadingText = Object.keys(EmptyListText).find((item) => item === 'LOADING');
  #loadingErrorText = Object.keys(EmptyListText).find((item) => item === 'LOADING_ERROR');
  #isLoading = true;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({tripMainContainer, routePointsListContainer, routePointsModel, filterModel,newRoutePointButtonComponent, onNewRoutePointDestroy }) {
    this.#tripMainContainer = tripMainContainer;
    this.#routePointsListContainer = routePointsListContainer;
    this.#newPointButton = newRoutePointButtonComponent.element;
    this.#routePointsModel = routePointsModel;
    this.#filterModel = filterModel;

    this.#newRoutePointPresenter = new NewRoutePointPresenter({
      routePointListComponent: this.#routePointListComponent.element,
      routePointsModel: this.#routePointsModel,
      onRoutePointChange: this.#handleViewAction,
      onDestroy: onNewRoutePointDestroy,
      onReset: this.#handleFormReset,
    });

    this.#routePointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get routePoints() {
    this.#filterType = this.#filterModel.filter;
    const routePoints = this.#routePointsModel.routePoints;
    const filteredPoint = filter[this.#filterType](routePoints);
    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoint.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoint.sort(sortByPrice);
    }
    return filteredPoint.sort(sortByDay);
  }

  get error() {
    return this.#routePointsModel.error;
  }

  init() {
    this.#renderMainComponent();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterType = FilterType.EVERYTHING;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newRoutePointPresenter.init();
    if (this.#emptyList) {
      remove(this.#emptyList);
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#routePointsPresenters.get(update.id).setSaving();
        try {
          await this.#routePointsModel.updateRoutePoint(updateType, update);
        } catch(err) {
          this.#routePointsPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newRoutePointPresenter.setSaving();
        try {
          await this.#routePointsModel.addRoutePoint(updateType, update);
        } catch(err) {
          console.log('handleViewAction')
          this.#newRoutePointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#routePointsPresenters.get(update.id).setDeleting();
        try {
          await this.#routePointsModel.deleteRoutePoint(updateType, update);
        } catch(err) {
          this.#routePointsPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#routePointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPage();
        this.#renderMainComponent();
        break;
      case UpdateType.MAJOR:
        this.#clearPage({resetSortType: true});
        this.#renderMainComponent();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderMainComponent();
        break;
    }
  };

  #clearPage({resetSortType = false} = {}) {
    this.#tripInfoPresenter.destroy();
    this.#newRoutePointPresenter.destroy();
    this.#routePointsPresenters.forEach((presenter) => presenter.destroy());
    this.#routePointsPresenters.clear();
    remove(this.#sorting);
    remove(this.#loadingComponent);
    if (this.#emptyList) {
      remove(this.#emptyList);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderRoutePoint(routePoint){
    const routePointPresenter = new RoutePointPresenter({
      routePointListComponent : this.#routePointListComponent.element,
      routePointsModel : this.#routePointsModel,
      onRoutePointChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    routePointPresenter.init(routePoint);
    this.#routePointsPresenters.set(routePoint.id, routePointPresenter);
  }

  #renderListEmpty(){
    this.#emptyList = new EmptyListView({
      filterType: this.#filterType
    });
    render(this.#emptyList, this.#routePointsListContainer);
  }

  #renderSorting(){
    this.#sorting = new SortView({
      checkedSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sorting, this.#routePointsListContainer);
  }

  #renderLoading() {
    this.#loadingComponent = new EmptyListView({
      filterType: this.#loadingText,
    });
    render(this.#loadingComponent, this.#routePointsListContainer);
  }

  #renderTripInfo() {
    this.#tripInfoPresenter = new TripInfoPresenter({
      routePointsModel: this.#routePointsModel,
      tripMainContainer: this.#tripMainContainer,
    });
    this.#tripInfoPresenter.init();
  }

  #renderLoadingError() {
    this.#loadingErrorComponent = new EmptyListView({
      filterType: this.#loadingErrorText,
    });
    this.#newPointButton.disabled = true;
    render(this.#loadingErrorComponent, this.#routePointsListContainer);
  }

  #renderRoutePointsList(){
    render(this.#routePointListComponent, this.#routePointsListContainer);
    this.routePoints.forEach((point) => this.#renderRoutePoint(point));
  }

  #renderMainComponent(){
    if (this.error) {
      this.#renderLoadingError();
      return;
    }
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (this.routePoints.length === 0){
      this.#renderListEmpty();
    }
    if (this.routePoints.length > 0){
      this.#renderSorting();
    }
    this.#renderTripInfo();
    this.#renderRoutePointsList();
  }


  #handleModeChange = () => {
    this.#newRoutePointPresenter.destroy();
    this.#routePointsPresenters.forEach((presenter) => presenter.resetView());
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPage();
    this.#renderMainComponent();
  };

  #handleFormReset = () => {
    if (this.routePoints.length === 0) {
      remove(this.#sorting);
      this.#renderListEmpty();
    }
  };
}
