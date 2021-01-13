import FormValidator from '../components/FormValidator.js';
import Section from '../components/Section.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage.js';
import UserInfo from '../components/UserInfo.js';
import { getNewCardElement } from '../utils/helpers.js';

import { 
  initialCardObjs,
  profileNameSelector,
  profileSelfDescriptionSelector,
  nameOfProfileEditForm,
  nameOfCardCreationForm,
  formInputSelector,
  cardPopupImageSelector,
  cardPopupImageTitleSelector,
  cardsCollectionSelector,
  cardTemplateSelector,
  addBtnElement,
  editBtnElement,
  popupCssObj,
  settingsObj
} from '../utils/constants.js';

import './index.css';

(function main() {

  // ########## creating objects ###########
  const popupWithImage = new PopupWithImage(
    cardPopupImageSelector, {
      ...popupCssObj,
      imageTitleSelector: cardPopupImageTitleSelector
    }
  );

  const cardListSection = new Section({ 
    items: initialCardObjs,
    renderer: (item) => {
      const newCardElement = getNewCardElement(
        item,
        popupWithImage,
        cardTemplateSelector
      );
      cardListSection.addItem(newCardElement);
    }
  }, cardsCollectionSelector);

  const userInfo = new UserInfo({ 
    nameOfUserSelector: profileNameSelector,
    descriptionAboutUserSelector: profileSelfDescriptionSelector
  });

  const profileEditFormValidator = new FormValidator(
    settingsObj,
    document.forms[nameOfProfileEditForm]
  );

  const cardCreationFormValidator = new FormValidator(
    settingsObj,
    document.forms[nameOfCardCreationForm]
  );
    
  
  const popupWithProfileEditForm = new PopupWithForm(
    nameOfProfileEditForm,
    {
      handleFormSubmit: (evt) => {
        evt.preventDefault();

        if(profileEditFormValidator.validateAllInputs()) return;

        const { profileName, aboutMe } = popupWithProfileEditForm.getInputValues();
        
        userInfo.setUserInfo({
          name: profileName,
          description: aboutMe
        });

        popupWithProfileEditForm.close();
      },
      peformActionPriorToFormOpening: () => {
        profileEditFormValidator.showNoErrors();
      }
    }, 
    {
      ...popupCssObj,
      inputSelector: formInputSelector
    }
  );

  const popupWithCardCreationForm = new PopupWithForm(
    nameOfCardCreationForm,
    {
      handleFormSubmit: (evt) => {
        evt.preventDefault();

        if(cardCreationFormValidator.validateAllInputs()) return;
        /*
          Because the form is reset before it completely fades,
          users are able to submit the form with invalid input;
          This guard clause prevents this from occurring.
        */

        const { locationTitle, imageLink } = popupWithCardCreationForm.getInputValues();

        const newCardElement = getNewCardElement(
          {
            name: locationTitle,
            link: imageLink
          }, 
          popupWithImage,
          cardTemplateSelector
        );
    
        cardListSection.addItem(newCardElement);
        popupWithCardCreationForm.close();
      },
      peformActionPriorToFormOpening: () => {
        cardCreationFormValidator.showNoErrors(true);
      }
    }, {
      ...popupCssObj,
      inputSelector: formInputSelector
    }
  );


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

  popupWithImage.setEventListeners();
  popupWithCardCreationForm.setEventListeners();
  popupWithProfileEditForm.setEventListeners();


  // ####### adding form validation #########
  profileEditFormValidator.enableValidation();
  cardCreationFormValidator.enableValidation();
  

  // ######## displaying initial cards ##########
  cardListSection.renderItems();
})();