import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(
    nameOfForm, 
    { handleFormSubmit, peformActionPriorToFormOpening },
    { 
      popupSelector,
      openedPopupClassName,
      clickedToClosePopupSelector,
      inputSelector,
      submitBtnSelector, 
      disabledSubmitBtnClassName 
    }
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
    this._submitBtnElement = this._formElement.querySelector(submitBtnSelector)
    this._disabledSubmitBtnClassName = disabledSubmitBtnClassName;

    this._handleFormSubmit = handleFormSubmit;
    this._performActionPriorToFormOpening = peformActionPriorToFormOpening;
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

  _disableSubmitBtn() {
    this._submitBtnElement.disabled = true;
    this._submitBtnElement.classList.add(this._disabledSubmitBtnClassName);

    /* Note: while it is true that this functionality exist in the class for form validations,
    the purpose is not the same, as this class is not concerned with validating input. */
  }

  getSubmitBtnText() {
    return this._submitBtnElement.textContent;
  }

  setSubmitBtnText(text) {
    this._submitBtnElement.textContent = text;
  }

  setEventListeners() {
    super.setEventListeners();
    this._formElement.addEventListener('submit', this._handleFormSubmit);
  }

  open() {
    if(this._performActionPriorToFormOpening != null) {
      // checking to see if there are any actions that the user of the class wants to perform
      this._performActionPriorToFormOpening();
    }
    super.open();
  }



  close() {
    super.close();
    this._disableSubmitBtn(); // keep form from being able to be submitted as the form closes.
    this._formElement.reset();
  }
}