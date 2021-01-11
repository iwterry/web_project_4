import Card from './Card.js';
import FormValidator from './FormValidator.js';
import { initialCardObjs } from './initial-data.js';
import { 
  showPopup, 
  hidePopup, 
  hidePopupByClickingOnOverlay, 
  handleHidePopup, 
  showCardImageWithPopup
} from './popup-util.js';
import Section from './Section.js';

(function main() {
  // ########### defining DOM element variables #########
  const overlays = document.querySelectorAll('.overlay');
  const closeButtons = document.querySelectorAll('.overlay__close-btn');

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

  const cardsCollectionSelector = '.locations__collection';
  const formElements = document.querySelectorAll('.project-form');

  const cardListSection = new Section({ 
    items: initialCardObjs,
    renderer: (item) => {
      const newCardElement = getNewCardElement(item);
      cardListSection.addItem(newCardElement);
    }
  }, cardsCollectionSelector);

  // ####### defining event handlers ######
  // ------ handlers dealing with editing profile
  function handleShowProfileEditForm() {
    // fill in input values with the given text content of the profile
    profileEditNameInput.value = profileName.textContent;
    profileEditAboutMeInput.value = profileSelfDescription.textContent;
    
    // show the form
    showPopup(profileEditForm);
  }

  function handleSaveProfile(evt) {
    evt.preventDefault();

    // fill in profile information from user input
    profileName.textContent = profileEditNameInput.value;
    profileSelfDescription.textContent = profileEditAboutMeInput.value;

    // hide the form
    hidePopup(profileEditForm);
  }

  // -------- handlers / helpers dealing with card
  function getNewCardElement(cardDataObj) {
    const cardTemplateSelector = '#location';
    const newCard = new Card(cardDataObj, cardTemplateSelector, showCardImageWithPopup);

    return newCard.generateNewCardElement();
  }

  function handleShowCardCreationForm() {
    showPopup(cardCreationForm);
  }

  function handleSaveCard(evt) {
    evt.preventDefault();

    const newCardElement = getNewCardElement({
      name: cardCreationTitleInput.value,
      link: cardCreationImageLinkInput.value
    });

    cardListSection.addItem(newCardElement);
    hidePopup(cardCreationForm);
  }

    // ------ adding data for cards, events listeners dealing with forms, and form validation --------
  function addInitialEventListeners() {
    // for buttons to show form
    editButton.addEventListener('click', handleShowProfileEditForm);
    addButton.addEventListener('click', handleShowCardCreationForm);
    // for forms
    profileEditForm.addEventListener('submit', handleSaveProfile);
    cardCreationForm.addEventListener('submit', handleSaveCard);
    // for popup closing functionality
    closeButtons.forEach((closeButton) => closeButton.addEventListener('click', handleHidePopup));
    overlays.forEach((overlay) => overlay.addEventListener(
      'click', 
      (evt) => hidePopupByClickingOnOverlay(evt.target, overlay)
    ));
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

    formElements.forEach(function (formElement) {
      const formValidator = new FormValidator(settingsObj, formElement);
      formValidator.enableValidation();
    });
  }



  cardListSection.renderItems();
  addInitialEventListeners();
  addFormValidation();
})();