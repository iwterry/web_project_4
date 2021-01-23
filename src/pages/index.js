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
  settingsObj,
  profileAvatarElement
} from '../utils/constants.js';

import './index.css';

(function main() {
  function getCards() {
    return fetch(
      'https://around.nomoreparties.co/v1/group-8/cards',
        {
            method: 'GET',
            headers: {
              authorization: 'f9c51bc0-ecec-42b1-bdb4-bcfabdba3e4f'
            }
        }
    ).then((res) => {
      if(res.ok) return res.json();
      else return Promise.reject(res.status);
    });
  }

  const userApiEndpoint = 'https://around.nomoreparties.co/v1/group-8/users/me';
  const cardsApiEndpoint = 'https://around.nomoreparties.co/v1/group-8/cards';

  function fetchData({url, method='GET', additionalHeaderProps={}, body=null}) {
    const init = {
      method,
      headers: {
        authorization: 'f9c51bc0-ecec-42b1-bdb4-bcfabdba3e4f',
        ...additionalHeaderProps
      }
    };

    if(body !== null) {
      init.body = body;
    }

    return fetch(url, init).then((res) => {
      if(res.ok) return res.json();
      else return Promise.reject(res.status);
    });
  }
  
  function getCardListSection(items, popupWithImage) {
    return new Section({ 
      items: items,
      renderer: (item) => {
        const newCardElement = getNewCardElement(
          item,
          popupWithImage,
          cardTemplateSelector
        );
        cardListSection.addItem(newCardElement);
      }
    }, cardsCollectionSelector);
  }

  // ########## creating objects ###########
  const popupWithImage = new PopupWithImage(
    cardPopupImageSelector, {
      ...popupCssObj,
      imageTitleSelector: cardPopupImageTitleSelector
    }
  );

  let cardListSection = getCardListSection([], popupWithImage);
  
  fetchData({ url: cardsApiEndpoint })
    .then((cardsFromApi) => {
      const cards = cardsFromApi.map(({ name, link }) => { name, link });
      cardListSection = getCardListSection(cards, popupWithImage);
      cardListSection.renderItems();
    })
    .catch((err) => console.log(`Error: ${err}`));

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

        fetchData({
          url: userApiEndpoint,
          method: 'PATCH',
          additionalHeaderProps: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: profileName,
            about: aboutMe
          })
        })
          .then(({ name, about }) => {
            userInfo.setUserInfo({
              name,
              description: about
            });
          })
          .catch((err) => console.log(`Error: ${err}`))
          .finally(() => popupWithProfileEditForm.close());
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

        fetchData({
          url: cardsApiEndpoint,
          method: 'POST',
          additionalHeaderProps: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: locationTitle,
            link: imageLink
          })
        })
          .then(({ name, link }) => {
            const newCardElement = getNewCardElement(
              { name, link }, 
              popupWithImage,
              cardTemplateSelector
            );
        
            cardListSection.addItem(newCardElement);
          })
          .catch((err) => console.log(`Error: ${err}`))
          .finally(() => popupWithCardCreationForm.close());
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
  



  function addUserToDom(user) {
    const { name, about, avatar } = user;
    userInfo.setUserInfo({
      name: name,
      description: about,
    });
    profileAvatarElement.src = avatar;
  }

  fetchData({ url: userApiEndpoint })
    .then(addUserToDom)
    .catch((err) => console.log(`Error: ${err}`));

})();



