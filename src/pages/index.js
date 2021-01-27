import FormValidator from '../components/FormValidator.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage.js';
import Api from '../components/Api.js';
import UserInfo from '../components/UserInfo.js';

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
  authToken
} from '../utils/constants.js';

import {
  displayInitialCards,
  getNewCardListSection,
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

  let cardListSection = getNewCardListSection(
    [], 
    { popupWithImage, api, popupWithConfirmationPromptForm }
  );
  /*
    Note: This cardListSection assignment should be temporary. Since getting the initial data
    happens asynchronously, I will perform the reassignment once I get the data. There are other
    approaches that would work as well, though.

    Another approach is to use async/await, but since the course did not go into this
    feature, I will stick to using Promises with "then" and "catch" pattern.
  */

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
      peformActionPriorToFormOpening: () => {
        profileEditFormValidator.showNoErrors();
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
      peformActionPriorToFormOpening: () => {
        cardCreationFormValidator.showNoErrors(true);
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
      peformActionPriorToFormOpening: () => {
        profileImgChangeFormValidator.showNoErrors(true);
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
  .then((cardsFromApi) => {
    cardListSection = displayInitialCards(
      cardsFromApi, 
      { userInfo, popupWithConfirmationPromptForm, popupWithImage, api }
    );
  })
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




