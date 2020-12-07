function getErrorMessageElementForInvalidInput(formInputElement) {
  return formInputElement.form.querySelector(`.project-form__input-error_field_${formInputElement.id}`);
}

function showInputError(formInputElement, errorMessage, inputErrorClassName, errorMsgVisibilityClassName) {
  const errorMessageElement = getErrorMessageElementForInvalidInput(formInputElement);

  formInputElement.classList.add(inputErrorClassName);
  errorMessageElement.classList.add(errorMsgVisibilityClassName);
  errorMessageElement.textContent = errorMessage;
}

function hideInputError(formInputElement, inputErrorClassName, errorMsgVisibilityClassName) {
  const errorMessageElement = getErrorMessageElementForInvalidInput(formInputElement);

  formInputElement.classList.remove(inputErrorClassName);
  errorMessageElement.classList.remove(errorMsgVisibilityClassName);
  errorMessageElement.textContent = '';
}


function checkInputValidity(formInputElement, inputErrorClassName, errorMsgVisibilityClassName) {
  if(formInputElement.validity.valid) {
    hideInputError(formInputElement, inputErrorClassName, errorMsgVisibilityClassName);
  } else {
    const errorMsg = formInputElement.validationMessage;
    showInputError(formInputElement, errorMsg, inputErrorClassName, errorMsgVisibilityClassName);
  }
}

function hasSomeInvalidInput(inputElementsArr) {
  return !inputElementsArr.every((inputElement) => inputElement.validity.valid);
}

function toggleButtonState(inputElementsArr, buttonElement, disabledBtnClassName) {
  if(hasSomeInvalidInput(inputElementsArr)) {
    buttonElement.classList.add(disabledBtnClassName);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(disabledBtnClassName);
    buttonElement.disabled = false;
  }
}

function enableValidation(cssClassesAndSelectorsObj) {
  const { 
    formSelector,
    inputSelector,
    disabledButtonClass,
    inputErrorClass,
    errorMsgVisibilityClass
  } = cssClassesAndSelectorsObj;
  const formElements = Array.from(document.querySelectorAll(formSelector));

  formElements.forEach(function(formElement) {
    const submitBtnElement = formElement.elements.submitBtn;
    const inputElements = Array.from(formElement.querySelectorAll(inputSelector)); 

    inputElements.forEach(function(inputElement) {
      inputElement.addEventListener('input', function handleInputValidation() {
        checkInputValidity(inputElement, inputErrorClass, errorMsgVisibilityClass);
        toggleButtonState(inputElements, submitBtnElement, disabledButtonClass);
      });      
    });
  });
}

enableValidation({
  formSelector: '.project-form',
  inputSelector: '.project-form__input',
  disabledButtonClass: 'project-form__submit-btn_disabled',
  inputErrorClass: 'project-form__input_type_error',
  errorMsgVisibilityClass: 'project-form__input-error_active',
}); 