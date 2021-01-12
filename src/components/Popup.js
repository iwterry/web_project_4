export default class Popup {
  constructor(
    selectorForPopupOrPopupDescendent,
    { popupSelector, openedPopupClassName, clickedToClosePopupSelector }
  ) {
    /*
      Note: Although the project instructions for Sprint 8 do not say to define the Popup
      class this way, I implemented it this way so that this JavaScript class is less
      loosely coupled with the CSS classes used for popups in a project. I wanted this 
      JavaScript class to be more generic and not tied too closely with how things are
      implemented in HTML and CSS.
    */
    this._popupElement = document.querySelector(selectorForPopupOrPopupDescendent)
      .closest(popupSelector);
    this._openedPopupClassName = openedPopupClassName;
    this._clickedToClosePopupSelector = clickedToClosePopupSelector;

    this._handleEscClose = (evt) => {
      /*
        Note: _handleEscClose is implemented this way to bind the 'this' keyword while being 
        able to add and remove the same event event listener; however,
        doing it this way means that each Popup instance will have its own _handleEscClose method,
        which may not be preferable. Another way around this may be to define the function outside
        of this class. It could go inside this file or be imported from another file.
      */
      const escKey = 'Escape';

      if(evt.key === escKey && this._popupElement.classList.contains(this._openedPopupClassName)) {
          this.close();
      }
    };
  }

  open() {
    this._popupElement.classList.add(this._openedPopupClassName);
    document.addEventListener('keydown', this._handleEscClose);
  }

  close() {
    this._popupElement.classList.remove(this._openedPopupClassName);
    document.removeEventListener('keydown', this._handleEscClose);
  }

  setEventListeners() {
    
    this._popupElement
      .querySelector(this._clickedToClosePopupSelector)
      .addEventListener('click', () => this.close());

    this._popupElement.addEventListener('click', ({ target: targetOfClick }) => {
      if(targetOfClick === this._popupElement) {
        this.close();
      }
    });   
  }
}

/*
const cardPopupImage = document.querySelector('.image-popup__image');
const cardPopupImageTitle = document.querySelector('.image-popup__title');

export function getOverlay(childOfOrIsAnOverlay) {
  return childOfOrIsAnOverlay.closest('.overlay');
}

export function hidePopup(childOfOrIsAnOverlay) {
  getOverlay(childOfOrIsAnOverlay).classList.remove('overlay_opened');
  document.removeEventListener('keydown', handleHidePopupThroughEscapeKey);
}

export function handleHidePopupThroughEscapeKey(evt) {
  if(evt.key === 'Escape') {
    const openedOverlay = document.querySelector('.overlay_opened');
    if(openedOverlay !== null) {
      hidePopup(openedOverlay);
    }  
  }
}

export function hidePopupByClickingOnOverlay(targetOfClick, overlay) {
  if(targetOfClick === overlay) {
    hidePopup(overlay);
  }
}
 
export function showPopup(childOfOrIsAnOverlay) {
  const overlay = getOverlay(childOfOrIsAnOverlay);
  overlay.classList.add('overlay_opened');

  document.addEventListener('keydown', handleHidePopupThroughEscapeKey);
}

export function handleHidePopup(evt) {
  const overlayCloseButton = evt.target;
  hidePopup(overlayCloseButton);
}

export function showCardImageWithPopup(cardImageLink, cardImageAlt) {
  cardPopupImage.src = cardImageLink;
  cardPopupImage.alt = cardImageAlt;
  cardPopupImageTitle.textContent = cardImageAlt;

  showPopup(cardPopupImage);
}
*/