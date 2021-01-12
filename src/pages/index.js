import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import { initialCardObjs } from '../utils/constants.js';
import Section from '../components/Section.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage.js';
import UserInfo from '../components/UserInfo.js';

(function main() {
  // ######## defining DOM element variables and CSS selectors / classnames #########
  const popupSelector = '.overlay';
  const openedPopupClassName = 'overlay_opened';
  const clickedToClosePopupSelector = '.overlay__close-btn';

  const profileNameSelector = '.profile__name';
  const profileSelfDescriptionSelector = '.profile__self-description';
  const editBtnSelector = '.profile__edit-btn';
  const addBtnSelector = '.profile__add-btn';
  const editButton = document.querySelector(editBtnSelector);
  const addButton = document.querySelector(addBtnSelector);

  const profileEditFormSelector = '.project-form_type_profile-edit';
  const cardCreationFormSelector = '.project-form_type_location-create';
  const formInputSelector = '.project-form__input';

  const cardsCollectionSelector = '.locations__collection';
  const formSelector = '.project-form';
  const formElements = document.querySelectorAll(formSelector);

  const cardPopupImageSelector = '.image-popup__image';
  const cardPopupImageTitleSelector= '.image-popup__title';

  const cardListSection = new Section({ 
    items: initialCardObjs,
    renderer: (item) => {
      const newCardElement = getNewCardElement(item);
      cardListSection.addItem(newCardElement);
    }
  }, cardsCollectionSelector);

  const popupWithImage = new PopupWithImage(
    cardPopupImageSelector, {
      popupSelector,
      openedPopupClassName,
      clickedToClosePopupSelector,
      imageTitleSelector: cardPopupImageTitleSelector
    }
  );

  const userInfo = new UserInfo({ 
    nameOfUserSelector: profileNameSelector,
    descriptionAboutUserSelector: profileSelfDescriptionSelector
  });

  const popupWithProfileEditForm = new PopupWithForm(
    profileEditFormSelector,
    function handleProfileEditFormSubmit(evt) {
      evt.preventDefault();

      const { profileName, aboutMe } = popupWithProfileEditForm.getInputValues();
      
      userInfo.setUserInfo({
        name: profileName,
        description: aboutMe
      });

      popupWithProfileEditForm.close();
    }, {
      popupSelector,
      openedPopupClassName,
      clickedToClosePopupSelector,
      inputSelector: formInputSelector
    }
  );

  const popupWithCardCreationForm = new PopupWithForm(
    cardCreationFormSelector,
    function handleCardCreationFormSubmit(evt) {
      evt.preventDefault();

      const { locationTitle, imageLink } = popupWithCardCreationForm.getInputValues();

      const newCardElement = getNewCardElement({
        name: locationTitle,
        link: imageLink
      });
  
      cardListSection.addItem(newCardElement);
      popupWithCardCreationForm.close();

    }, {
      popupSelector,
      openedPopupClassName,
      clickedToClosePopupSelector,
      inputSelector: formInputSelector
    }
  );


  // ####### defining event handlers ######
  // ------ handlers dealing with editing profile
  function handleShowProfileEditForm() {
    const { name, description } = userInfo.getUserInfo(); 
    
    popupWithProfileEditForm.setInputValues({
      profileName: name,
      aboutMe: description
    });
    popupWithProfileEditForm.open()
  }

  // -------- handlers / helpers dealing with card
  function getNewCardElement({ name, link }) {
    const cardTemplateSelector = '#location';

    const newCard = new Card(
       { name, link },
      cardTemplateSelector, 
      () => popupWithImage.open(link, name)
    );

    return newCard.generateNewCardElement();
  }

  function handleShowCardCreationForm() {
    popupWithCardCreationForm.open();
  }

    // ------ adding data for cards, events listeners dealing with forms, and form validation --------
  function addInitialEventListeners() {
    editButton.addEventListener('click', handleShowProfileEditForm);
    addButton.addEventListener('click', handleShowCardCreationForm);
    popupWithImage.setEventListeners();
    popupWithCardCreationForm.setEventListeners();
    popupWithProfileEditForm.setEventListeners()
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