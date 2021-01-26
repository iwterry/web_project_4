export default class Card {

  constructor(
    { id,  name, link, initialNumLikes=0, isLiked=false, isOwner=true }, 
    cardTemplateSelector, 
    { handleCardClick, getUpdatedNumLikesFromApiAfterUserAction, handleDeleteCard }
  ) {

    this._title = name;
    this._imageLink = link
    this._initialNumLikes = initialNumLikes;
    this._isLiked = isLiked;
    this._isOwner = isOwner;
    this._id = id;

    this._handleCardClick = handleCardClick;
    this._getUpdatedNumLikesFromApiAfterUserAction = getUpdatedNumLikesFromApiAfterUserAction;
    this._handleDeleteCard = handleDeleteCard;
   
    this._templateSelector = cardTemplateSelector;
    this._domElements = {};

    if(Card._cards == null) { // just a way to create a static property
      Card._cards = new Map();
    }

    Card._save(this);

    // Note: I am saving each Card instance in order to be deleted from UI when requested.
  }

  static _save(card) {
    this._cards.set(card._id, card);
  }

  static delete(cardId) {
    const { _cards: cards } = this; 

    if(cards.has(cardId)) {
      cards.get(cardId)._deleteCard();
      cards.delete(cardId);
    }
  }

  _initDomElements() {
    const cardElement = this._getPlainCardElement();

    this._domElements = {
      card: cardElement,
      image: cardElement.querySelector('.location__image'),
      likeBtn: cardElement.querySelector('.location__like-btn'),
      numLikes: cardElement.querySelector('.location__num-likes'),
      deleteBtn: cardElement.querySelector('.location__delete-btn'),
      title: cardElement.querySelector('.location__name')
    };
  }

  _getPlainCardElement() {
    const cardTemplateElement = document.querySelector(this._templateSelector);
    const plainCardElement = cardTemplateElement
      .content
      .querySelector('.location')
      .cloneNode(true);

    return plainCardElement;
  }

  _fillDomElementsWithData() {
    const { _domElements: domElements } = this;

    domElements.title.textContent = this._title;
    domElements.image.src = this._imageLink;
    domElements.image.alt = this._title;

    if(this._isOwner) {
      domElements.deleteBtn.classList.add('location__delete-btn_active');
    }
    this._updateLikeInfoDom(this._initialNumLikes);
  }
  
  _deleteCard() {
    this._domElements.card.remove();
  }

  _updateNumLikes(numLikes) {
    this._domElements.numLikes.textContent = numLikes;
  }

  _likingCard(numLikes) {
    this._domElements.likeBtn.classList.add('location__like-btn_active');
    this._updateNumLikes(numLikes);
  }

  _unlikingCard(numLikes) {
    this._domElements.likeBtn.classList.remove('location__like-btn_active');
    this._updateNumLikes(numLikes);
  }

  _updateLikeInfoDom(numLikes) {
    if (this._isLiked) {
      this._likingCard(numLikes);
    } else {
      this._unlikingCard(numLikes);
    }
  }

  _handleClickedLikeBtn() {
    this._getUpdatedNumLikesFromApiAfterUserAction(this._id, !this._isLiked)
      .then((numLikes) => {
        this._isLiked = !this._isLiked;
        this._updateLikeInfoDom(numLikes);
      });
  }

  _addEventListenersToDomElements() {
    const { _domElements: domElements } = this;
    domElements.deleteBtn.addEventListener('click', () => this._handleDeleteCard(this._id));
    domElements.likeBtn.addEventListener('click', () => this._handleClickedLikeBtn());
    domElements.image.addEventListener('click', this._handleCardClick);
  }

  generateNewCardElement() {
    this._initDomElements();
    this._fillDomElementsWithData();
    this._addEventListenersToDomElements();

    return this._domElements.card;
  }
}