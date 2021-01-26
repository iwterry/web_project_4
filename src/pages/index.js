import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import Section from '../components/Section.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage.js';
import UserInfo from '../components/UserInfo.js';
import { getNewCardElement } from '../utils/helpers.js';

import { 
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
  profileAvatarSelector,
  profileAvatarOverlaySelector,
  nameOfConfirmationPromptForm,
  nameOfProfileImgChangeForm,
  submitBtnTextWhileProcessing,
  cardCssObj
} from '../utils/constants.js';

import './index.css';

(function main() {
  const userApiEndpoint = 'https://around.nomoreparties.co/v1/group-8/users/me';
  const cardsApiEndpoint = 'https://around.nomoreparties.co/v1/group-8/cards';
  const cardLikesApiEndpointBase = 'https://around.nomoreparties.co/v1/group-8/cards/likes';
  const userAvatarApiEndpoint = 'https://around.nomoreparties.co/v1/group-8/users/me/avatar';

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
      renderer: (cardData) => {
        const newCardElement = getNewCardElement(
          cardTemplateSelector,
          {
            cardInfo: cardData,
            css: cardCssObj
          },
          {
            handleCardClick: () => popupWithImage.open(cardData.link, cardData.name),
            getUpdatedNumLikesFromApiAfterUserAction: handleLikingCard,
            handleDeleteCard: handleDeletingCard
          }
        );
        cardListSection.addItem(newCardElement);
      }
    }, cardsCollectionSelector);
  }

  function handleLikingCard(cardId, isLiking) {
    return fetchData({
      url: `${cardLikesApiEndpointBase}/${cardId}`,
      method: isLiking ? 'PUT' : 'DELETE'
    })
      .then(({ likes }) => likes.length)
      .catch((err) => console.log(`Error: ${err}`));
  }

  function handleDeletingCard(cardId) {
    popupWithConfirmationPromptForm.setInputValues({id: cardId});
    popupWithConfirmationPromptForm.open();
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
      const { id: userId } = userInfo.getUserInfo();
      const cards = cardsFromApi.map(({ name, link, likes, _id, owner }) => { 

        const isCardLikedByUser = likes.some((someUser) => someUser._id === userId);
        const isUserTheOwner = owner._id === userId;

        console.log(userId, isCardLikedByUser, likes);
        console.log(owner);
        return { 
          name, 
          link, 
          initialNumLikes: likes.length, 
          id : _id,
          isLiked: isCardLikedByUser,
          isOwner: isUserTheOwner
        };
      });
      cardListSection = getCardListSection(cards, popupWithImage);
      cardListSection.renderItems();
    })
    .catch((err) => console.log(`Error: ${err}`));

  const userInfo = new UserInfo({
    nameOfUserSelector: profileNameSelector,
    descriptionAboutUserSelector: profileSelfDescriptionSelector,
    avatarForUserSelector: profileAvatarSelector,
    avatarOverlaySelector: profileAvatarOverlaySelector
  }, () => popupWithProfileImgChangeForm.open());

  const profileEditFormValidator = new FormValidator(
    settingsObj,
    document.forms[nameOfProfileEditForm]
  );

  const cardCreationFormValidator = new FormValidator(
    settingsObj,
    document.forms[nameOfCardCreationForm]
  );

  const profileImgChangeFormValidator = new FormValidator(
    settingsObj,
    document.forms[nameOfProfileImgChangeForm]
  );
    
  
  const popupWithProfileEditForm = new PopupWithForm(
    nameOfProfileEditForm,
    {
      handleFormSubmit: (evt) => {
        evt.preventDefault();

        const { profileName, aboutMe } = popupWithProfileEditForm.getInputValues();
        const originalText = popupWithProfileEditForm.getSubmitBtnText();
        // I am saving the button so that I do not need to know what it is in the HTML.
        // This is to help make it less coupled.

        popupWithProfileEditForm.setSubmitBtnText(submitBtnTextWhileProcessing);

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
          .finally(() => {
            popupWithProfileEditForm.setSubmitBtnText(originalText);
            popupWithProfileEditForm.close();
          });
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

        const { locationTitle, imageLink } = popupWithCardCreationForm.getInputValues();
        const orignalText = popupWithCardCreationForm.getSubmitBtnText();

        popupWithCardCreationForm.setSubmitBtnText(submitBtnTextWhileProcessing);

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
          .then(({ name, link, _id }) => {
            const newCardElement = getNewCardElement(
              cardTemplateSelector,
              {
                cardInfo: { name, link, id: _id },
                css: cardCssObj
              },
              { 
                handleCardClick: () => popupWithImage.open(link, name),
                handleDeleteCard: handleDeletingCard,
                getUpdatedNumLikesFromApiAfterUserAction: handleLikingCard

              }
              
            );
        
            cardListSection.addItem(newCardElement);
          })
          .catch((err) => console.log(`Error: ${err}`))
          .finally(() => {
            popupWithCardCreationForm.setSubmitBtnText(orignalText);
            popupWithCardCreationForm.close();
          });
      },
      peformActionPriorToFormOpening: () => {
        cardCreationFormValidator.showNoErrors(true);
      }
    }, {
      ...popupCssObj,
      inputSelector: formInputSelector
    }
  );

  const popupWithConfirmationPromptForm = new PopupWithForm(
    nameOfConfirmationPromptForm,
    {
      handleFormSubmit: (evt) => {
        evt.preventDefault();

        const { id: cardId } = popupWithConfirmationPromptForm.getInputValues();

        fetchData({
          url: `${cardsApiEndpoint}/${cardId}`,
          method: 'DELETE'
        })
          .then(() => Card.delete(cardId))
          .catch((err) => console.log(`Error: ${err}`))
          .finally(() => popupWithConfirmationPromptForm.close());
      }
    }, {
      ...popupCssObj,
      inputSelector: formInputSelector
    }
  );

  const popupWithProfileImgChangeForm = new PopupWithForm(
    nameOfProfileImgChangeForm,
    {
      handleFormSubmit: (evt) => {
        evt.preventDefault();

        const { avatarLink } = popupWithProfileImgChangeForm.getInputValues();

        const originalText = popupWithProfileImgChangeForm.getSubmitBtnText();
        popupWithProfileImgChangeForm.setSubmitBtnText('Saving...');

        fetchData({
          url: userAvatarApiEndpoint,
          method: 'PATCH',
          additionalHeaderProps: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            avatar: avatarLink
          })
        })
          .then(({ avatar }) => userInfo.setUserInfo({ avatarLink: avatar }))
          .catch((err) => console.log( `Error: ${err}`))
          .finally(() => {
            popupWithProfileImgChangeForm.setSubmitBtnText(originalText);
            popupWithProfileImgChangeForm.close();
          });
      },
      peformActionPriorToFormOpening: () => {
        profileImgChangeFormValidator.showNoErrors(true);
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
  



  function addUserToDom({ name, about, avatar, _id }) {
    userInfo.setUserInfo({
      id: _id,
      name: name,
      description: about,
      avatarLink: avatar
    });
  }

  fetchData({ url: userApiEndpoint })
    .then(addUserToDom)
    .catch((err) => console.log(`Error: ${err}`));

})();



