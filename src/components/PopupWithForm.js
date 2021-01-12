import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(
    selectorForForm, 
    handleFormSubmit,
    { popupSelector, openedPopupClassName, clickedToClosePopupSelector, inputSelector }
  ) {

    super(selectorForForm, { popupSelector, openedPopupClassName, clickedToClosePopupSelector });
    this._formElement = document.querySelector(selectorForForm);
    this._inputElements = Array.from(this._formElement.querySelectorAll(inputSelector));
    this._handleFormSubmit = handleFormSubmit;
  }

  getInputValues() {
    return this._inputElements.reduce(function(inputs, inputElement) {
        inputs[inputElement.name] = inputElement.value;
        return inputs;
    }, {});
  }

  setInputValues(inputData) {
    this._inputElements.forEach((inputElement) => {
      if(inputData.hasOwnProperty(inputElement.name)) {
        inputElement.value = inputData[inputElement.name];
      }
    });
  }

  setEventListeners() {
    super.setEventListeners();
    this._formElement.addEventListener('submit', this._handleFormSubmit);
  }

  close() {
    super.close();
    this._formElement.reset();
  }
}