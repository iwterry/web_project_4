export default class Card {
  constructor(cardDataObj, cardTemplateSelector, handleShowingCardImageAsPopup) {
    this._title = cardDataObj.name;
    this._imageLink = cardDataObj.link;
    this._templateSelector = cardTemplateSelector;
    this._element = null;
    this._handleShowingCardImageAsPopup = handleShowingCardImageAsPopup
  }

  _getPlainCardElement() {
    const cardTemplateElement = document.querySelector(this._templateSelector);
    const plainCardElement = cardTemplateElement
      .content
      .querySelector('.location')
      .cloneNode(true);

    return plainCardElement;
  }

  _fillCardElementWithData() {
    const cardElement = this._getPlainCardElement();
    const cardImageElement = cardElement.querySelector('.location__image');
    const cardTitleElement = cardElement.querySelector('.location__name');
  
    cardTitleElement.textContent = this._title;
    cardImageElement.src = this._imageLink;
    cardImageElement.alt = this._title;
    
    this._element = cardElement;
  }
  
  _handleDeletingCard(evt) {
    const eventTarget = evt.target;
    eventTarget.closest('.location').remove();
  }
  
  _handleLikingCard(evt) {
    const eventTarget = evt.target;
    eventTarget.classList.toggle('location__like-btn_active');
  }

  _addEventListenersForCardElement() {
    const cardDeleteBtnElement = this._element.querySelector('.location__delete-btn');
    const cardLikeBtnElement = this._element.querySelector('.location__like-btn');
    const cardImageElement = this._element.querySelector('.location__image');

    cardDeleteBtnElement.addEventListener('click', this._handleDeletingCard);
    cardLikeBtnElement.addEventListener('click', this._handleLikingCard);
    cardImageElement.addEventListener(
      'click',
      () => this._handleShowingCardImageAsPopup(this._imageLink, this._title)
    );
  }

  generateNewCardElement() {
    this._fillCardElementWithData();
    this._addEventListenersForCardElement();

    return this._element;
  }
}