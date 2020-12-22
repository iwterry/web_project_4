import Popup from './Popup.js';
import Card from './Card.js';
import FormValidator from './FormValidator.js';
import { initialCardObjs } from './initial-data.js';

// wrapping code in an IIFE to minimize global variables
(function main() {
  // ------- defining DOM element variables -------
  const profileName = document.querySelector('.profile__name');
  const profileSelfDescription = document.querySelector('.profile__self-description');
  const editButton = document.querySelector('.profile__edit-btn');
  const addButton = document.querySelector('.profile__add-btn');

  const profileEditForm = document.forms.profileEditForm;
  const profileEditNameInput = profileEditForm.elements.profileName;
  const profileEditAboutMeInput = profileEditForm.elements.aboutMe;

  const cardCreationForm = document.forms.locationCreateForm;
  const cardCreationTitleInput = cardCreationForm.elements.locationTitle;
  const cardCreationImageLinkInput = cardCreationForm.elements.imageLink;

  const cardsCollection = document.querySelector('.locations__collection');
  const formElements = document.querySelectorAll('.project-form');

  // ------ handlers dealing with editing profile
  function handleShowProfileEditForm() {
    // fill in input values with the given text content of the profile
    profileEditNameInput.value = profileName.textContent;
    profileEditAboutMeInput.value = profileSelfDescription.textContent;
    
    // show the form
    const popup = new Popup(profileEditForm);
    popup.show();
  }

  function handleSaveProfile(evt) {
    evt.preventDefault();

    // fill in profile information from user input
    profileName.textContent = profileEditNameInput.value;
    profileSelfDescription.textContent = profileEditAboutMeInput.value;

    // hide the form
    const popup = new Popup(profileEditForm);
    popup.hide();
  }

  // -------- handlers / helpers dealing with card
  function addCardToDom(cardElement) {
    cardsCollection.prepend(cardElement);
  }

  function handleShowCardCreationForm() {
    const popup = new Popup(cardCreationForm);
    popup.show();
  }

  function handleSaveCard(evt) {
    evt.preventDefault();

    const newCard = new Card({
      name: cardCreationTitleInput.value,
      link: cardCreationImageLinkInput.value
    }, '#location');

    addCardToDom(newCard.generateNewCardElement());

    const popup = new Popup(cardCreationForm);
    popup.hide();
  }

  // ------ adding data for cards, events listeners dealing with forms, and form validation --------
  function addInitialCardsToDom() {
    initialCardObjs.forEach(function(cardDataObj) {
      const card = new Card(cardDataObj, '#location');
      addCardToDom(card.generateNewCardElement());
    });
  }

  function addInitialEventListeners() {
    // for buttons to show form
    editButton.addEventListener('click', handleShowProfileEditForm);
    addButton.addEventListener('click', handleShowCardCreationForm);
    // for forms
    profileEditForm.addEventListener('submit', handleSaveProfile);
    cardCreationForm.addEventListener('submit', handleSaveCard);
  }

  function addFormValidation() {
    const settingsObj = {
      inputSelector: '.project-form__input',
      inputErrorMsgSelectorPrefix: '.project-form__input-error_field_',
      submitBtnSelector: '.project-form__submit-btn',
      disabledButtonClass: 'project-form__submit-btn_disabled',
      inputErrorClass: 'project-form__input_type_error',
      errorMsgVisibilityClass: 'project-form__input-error_active',
    };
    
    formElements.forEach(function(formElement) {
      const formValidator = new FormValidator(settingsObj, formElement);
      formValidator.enableValidation();
    });
  }

  addInitialCardsToDom();
  addInitialEventListeners();
  addFormValidation();
})();
