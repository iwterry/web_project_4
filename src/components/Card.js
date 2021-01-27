/*
  Note: I changee how Card class is defined so that it is easier to
  understand what arguments are used for the constructor, better IDE support,
  and decoupling this JavaScript class from the actual CSS selectors and class names.
*/

export default class Card {

  constructor(
    cardTemplateSelector,
    { 
      cardInfo: {
        name,
        link,
        id,
        initialNumLikes=0, 
        isLiked=false, 
        isOwner=true
      },
      css: {
        cardSelector, 
        imageSelector, 
        titleSelector,
        likeBtnSelector,
        deleteBtnSelector,
        numLikesSelector,
        likeBtnActiveClassName,
        deleteBtnActiveClassName
      } 
    },
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
    this._css = {
      cardSelector,
      imageSelector, 
      titleSelector,
      likeBtnSelector,
      deleteBtnSelector,
      numLikesSelector,
      likeBtnActiveClassName,
      deleteBtnActiveClassName
    };

    this._domElements = {
      card: null,
      image: null,
      likeBtn: null,
      numLikes: null,
      deleteBtn: null,
      title: null
    }; 
    
    // I am listing the _css and _domElements properties for readability and IDE support

    if(Card._cards == null) { // just one way to create a static property
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
    const { _css: css, _domElements: domElements } = this;

    domElements.card = cardElement;
    domElements.image = cardElement.querySelector(css.imageSelector);
    domElements.likeBtn = cardElement.querySelector(css.likeBtnSelector);
    domElements.numLikes = cardElement.querySelector(css.numLikesSelector);
    domElements.deleteBtn = cardElement.querySelector(css.deleteBtnSelector);
    domElements.title = cardElement.querySelector(css.titleSelector);
  }

  _getPlainCardElement() {
    const cardTemplateElement = document.querySelector(this._templateSelector);
    const plainCardElement = cardTemplateElement
      .content
      .querySelector(this._css.cardSelector)
      .cloneNode(true);

    return plainCardElement;
  }

  _fillDomElementsWithData() {
    const { _domElements: domElements } = this;

    domElements.title.textContent = this._title;
    domElements.image.src = this._imageLink;
    domElements.image.alt = this._title;

    if(this._isOwner) {
      domElements.deleteBtn.classList.add(this._css.deleteBtnActiveClassName);
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
    this._domElements.likeBtn.classList.add(this._css.likeBtnActiveClassName);
    this._updateNumLikes(numLikes);
  }

  _unlikingCard(numLikes) {
    this._domElements.likeBtn.classList.remove(this._css.likeBtnActiveClassName);
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
      .then(({ numLikes }) => {
        if(typeof numLikes === 'number') {
          this._isLiked = !this._isLiked;
          this._updateLikeInfoDom(numLikes);
        }
      });

      /* 
        Note: There is no "catch" because if numLikes is not a number, then an error
        occurred and it was handled by the getUpdatedNumLikesFromApiAfterUserAction callback.
        As far as the responsibility of this class goes, there is no further action to take.
      */
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