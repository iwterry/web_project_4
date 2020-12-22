/* Although the project instructions did not say make a Popup class, I felt that it
 is appropriate given the complexity of dealing with popups in this project. */
export default class Popup {
  constructor(childOfOrIsAnOverlay) {
    this._overlay = childOfOrIsAnOverlay.closest('.overlay');
    this._refToListenerForHidingThroughEscKey = null;
    this._addEventListeners();
  }
  
  _hide() {
    this._overlay.classList.remove('overlay_opened');
    document.removeEventListener('keydown', this._refToListenerForHidingThroughEscKey);
    this._refToListenerForHidingThroughEscKey = null;
  }
  
  _handleHidingPopupThroughEscapeKey(evt) {
    if(evt.key === 'Escape' && this._overlay.classList.contains('overlay_opened')) {
      this._hide();
    }
  }
  
  _handleHidingPopupByClickingOnOverlay(evt) {
    const targetOfClick = evt.target;
    
    if(targetOfClick === this._overlay) {
      this._hide();
    }
  }

  _handleHidingPopup(evt) {
    const overlayCloseButton = evt.target;
    this._hide(overlayCloseButton);
  }

  _addEventListeners() {
    const overlayCloseBtn = this._overlay.querySelector('.overlay__close-btn');

    this._overlay.addEventListener('click', (evt) => this._handleHidingPopupByClickingOnOverlay(evt));
    overlayCloseBtn.addEventListener('click', (evt) => this._handleHidingPopup(evt));
  }

  show() {
    this._overlay.classList.add('overlay_opened');
    this._refToListenerForHidingThroughEscKey = (evt) => this._handleHidingPopupThroughEscapeKey(evt);
  
    document.addEventListener('keydown', this._refToListenerForHidingThroughEscKey);
  }

  // creating a public hide method so that the private methods are not depending on a public method
  hide() {
    this._hide();
  }
}