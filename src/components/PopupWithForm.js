import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(
    nameOfForm, 
    handleFormSubmit,
    { popupSelector, openedPopupClassName, clickedToClosePopupSelector, inputSelector }
  ) {

    super(
      `form[name="${nameOfForm}"`, 
      { popupSelector, openedPopupClassName, clickedToClosePopupSelector }
    );

    /* 
      Note: I am providing an attribute selector to super() since a form name is supposed
      to be unique among all forms in a given document in HTML 5. The attribute selector is
      used over classes to avoid the situation where a class selector is given where it would
      match multiple forms.
    */
    this._formElement = document.forms[nameOfForm];
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