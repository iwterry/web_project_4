export default class FormValidator {
  constructor(settingsObj, formElement) {
    this._inputElementSelector = settingsObj.inputSelector;
    this._inputErrorMsgElementSelectorPrefix = settingsObj.inputErrorMsgSelectorPrefix;
    this._disabledBtnClassName = settingsObj.disabledButtonClass;
    this._inputErrorClassName = settingsObj.inputErrorClass;
    this._errorMsgVisibilityClassName = settingsObj.errorMsgVisibilityClass;

    this._formElement = formElement;
    this._inputElements = Array.from(this._formElement.querySelectorAll(this._inputElementSelector));
    this._submitBtnElement = this._formElement.querySelector(settingsObj.submitBtnSelector); 
  }

  _getErrorMessageElementForInvalidInput(formInputElement) {
    return this._formElement.querySelector(`${this._inputErrorMsgElementSelectorPrefix}${formInputElement.id}`);
  }
  
  _showInputError(formInputElement, errorMessage) {
    const errorMessageElement = this._getErrorMessageElementForInvalidInput(formInputElement);
  
    formInputElement.classList.add(this._inputErrorClassName);
    errorMessageElement.classList.add(this._errorMsgVisibilityClassName);
    errorMessageElement.textContent = errorMessage;
  }
  
  _hideInputError(formInputElement) {
    const errorMessageElement = this._getErrorMessageElementForInvalidInput(formInputElement);
  
    formInputElement.classList.remove(this._inputErrorClassName);
    errorMessageElement.classList.remove(this._errorMsgVisibilityClassName);
    errorMessageElement.textContent = '';
  }
  
  _checkInputValidity(formInputElement) {
    if(formInputElement.validity.valid) {
      this._hideInputError(formInputElement);
    } else {
      const errorMsg = formInputElement.validationMessage;
      this._showInputError(formInputElement, errorMsg);
    }
  }
  
  _hasSomeInvalidInput() {
    return !this._inputElements.every((inputElement) => inputElement.validity.valid);
  }

  _enableButton() {
    this._submitBtnElement.classList.remove(this._disabledBtnClassName);
    this._submitBtnElement.disabled = false;
  }

  _disableButton() {
    this._submitBtnElement.classList.add(this._disabledBtnClassName);
    this._submitBtnElement.disabled = true;
  }
  
  _toggleButtonState() {
    if(this._hasSomeInvalidInput()) {
      this._disableButton();
    } else {
      this._enableButton();
    }
  }

  _handleInputValidation(inputElement) {
    this._checkInputValidity(inputElement);
    this._toggleButtonState();
  }
  
  _addEventListener(inputElement) {
    inputElement.addEventListener('input', () => this._handleInputValidation(inputElement));
  }

  showNoErrors(isButtonDisabled=false) {
    this._inputElements.forEach((inputElement) => this._hideInputError(inputElement));
    isButtonDisabled ? this._disableButton() : this._enableButton();
  }

  enableValidation() {
    this._inputElements.forEach((inputElement) => this._addEventListener(inputElement));
  }
}