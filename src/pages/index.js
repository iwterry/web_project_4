import FormValidator from '../components/FormValidator.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage.js';
import Api from '../components/Api.js';
import UserInfo from '../components/UserInfo.js';
import Section from '../components/Section.js';

import { 
  profileNameSelector,
  profileSelfDescriptionSelector,
  nameOfProfileEditForm,
  nameOfCardCreationForm,
  cardPopupImageSelector,
  addBtnElement,
  editBtnElement,
  popupFormCssObj,
  popupImageCssObj,
  formValidatorCssObj,
  profileAvatarSelector,
  profileAvatarOverlaySelector,
  nameOfConfirmationPromptForm,
  nameOfProfileImgChangeForm,
  authToken,
  cardsCollectionSelector
} from '../utils/constants.js';

import {
  displayInitialCards,
  getNewCardElement,
  handleFormSubmitForCardCreationForm,
  handleFormSubmitForConfirmationPromptForm,
  handleFormSubmitForProfileEditForm,
  handleFormSubmitForProfileImgChangeForm,
  logErrors
} from '../utils/helpers';

import './index.css';


(function main() {
  // ########## creating objects ###########
  const popupWithImage = new PopupWithImage(cardPopupImageSelector, popupImageCssObj);

  const userInfo = new UserInfo({
    nameOfUserSelector: profileNameSelector,
    descriptionAboutUserSelector: profileSelfDescriptionSelector,
    avatarForUserSelector: profileAvatarSelector,
    avatarOverlaySelector: profileAvatarOverlaySelector
  }, () => popupWithProfileImgChangeForm.open());

  const api = new Api({
    headers: { authorization: authToken }
  });

  const popupWithConfirmationPromptForm = new PopupWithForm(
    nameOfConfirmationPromptForm,
    {
      handleFormSubmit: (evt) => {
        evt.preventDefault();
        handleFormSubmitForConfirmationPromptForm(popupWithConfirmationPromptForm, api);
      }
    }, 
    popupFormCssObj
  );

  const cardListSection = new Section(
    { 
      renderer: (cardData) => {
        const newCardElement = getNewCardElement(
          cardData,
          { popupWithConfirmationPromptForm, api, popupWithImage }
        );

        cardListSection.addItem(newCardElement);
      }
    }, 
    cardsCollectionSelector
  );

  const profileEditFormValidator = new FormValidator(
    formValidatorCssObj,
    document.forms[nameOfProfileEditForm]
  );

  const cardCreationFormValidator = new FormValidator(
    formValidatorCssObj,
    document.forms[nameOfCardCreationForm]
  );

  const profileImgChangeFormValidator = new FormValidator(
    formValidatorCssObj,
    document.forms[nameOfProfileImgChangeForm]
  );
    
  const popupWithProfileEditForm = new PopupWithForm(
    nameOfProfileEditForm,
    {
      handleFormSubmit: (evt) => {
        evt.preventDefault();
        handleFormSubmitForProfileEditForm(popupWithProfileEditForm, api, userInfo);
      },
      performActionPriorToFormOpening: () => {
        profileEditFormValidator.showNoErrorsButDisableSubmitBtnWhenHasAnError();
      }
    }, 
    popupFormCssObj
  );

  const popupWithCardCreationForm = new PopupWithForm(
    nameOfCardCreationForm,
    {
      handleFormSubmit: (evt) => {
        evt.preventDefault();
        handleFormSubmitForCardCreationForm({
          popupWithCardCreationForm,
          api,
          popupWithImage,
          popupWithConfirmationPromptForm,
          cardListSection
        });
      },
      performActionPriorToFormOpening: () => {
        cardCreationFormValidator.showNoErrorsButDisableSubmitBtnWhenHasAnError();
      }
    }, 
    popupFormCssObj
  );

  const popupWithProfileImgChangeForm = new PopupWithForm(
    nameOfProfileImgChangeForm,
    {
      handleFormSubmit: (evt) => {
        evt.preventDefault();
        handleFormSubmitForProfileImgChangeForm(popupWithProfileImgChangeForm, api, userInfo);
      },
      performActionPriorToFormOpening: () => {
        profileImgChangeFormValidator.showNoErrorsButDisableSubmitBtnWhenHasAnError();
      }
    }, 
    popupFormCssObj
  );


  // ####### retrieving / showing profile and card information #######
  api.getUserProfile()
  .then(({ _id, name, about, avatar }) => {
    userInfo.setUserInfo({
      id: _id,
      name: name,
      description: about,
      avatarLink: avatar
    });

    return api.getInitialCards();
  })    
  .then((cardsFromApi) => displayInitialCards(cardsFromApi, userInfo, cardListSection))
  .catch(logErrors);


  // ####### setting event listeners ######
  editBtnElement.addEventListener('click', () => {
    const { name, description } = userInfo.getUserInfo(); 
    
    popupWithProfileEditForm.setInputValues({
      profileName: name,
      aboutMe: description
    });
    popupWithProfileEditForm.open()
  });

  addBtnElement.addEventListener('click', () => popupWithCardCreationForm.open());

  userInfo.setEventListeners();

  popupWithImage.setEventListeners();
  popupWithCardCreationForm.setEventListeners();
  popupWithProfileEditForm.setEventListeners();
  popupWithConfirmationPromptForm.setEventListeners();
  popupWithProfileImgChangeForm.setEventListeners();


  // ####### adding form validation #########
  profileEditFormValidator.enableValidation();
  cardCreationFormValidator.enableValidation();
  profileImgChangeFormValidator.enableValidation();
})();




