import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
  constructor( 
    selectorForImage,
    { popupSelector, openedPopupClassName, clickedToClosePopupSelector, imageTitleSelector }
  ) {

    super(
      selectorForImage,
      { popupSelector, openedPopupClassName, clickedToClosePopupSelector }
    );

    this._imageElement = document.querySelector(selectorForImage);
    this._imageTitleElement = document.querySelector(imageTitleSelector);
  }

  open(imageLink, imageAltText) {
    this._imageElement.src = imageLink;
    this._imageElement.alt = imageAltText;
    this._imageTitleElement.textContent = imageAltText;

    super.open();
  }
}