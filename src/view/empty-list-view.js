import AbstractView from '../framework/view/abstract-view.js';
import {EmptyListText} from '../const.js';

function createEmptyListTemplate(filterType){
  const listEmptyValue = EmptyListText[filterType];
  return `<p class="trip-events__msg">${listEmptyValue}</p>`;
}

export default class EmptyListView extends AbstractView{
  #filterType = null;
  constructor({filterType}){
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
