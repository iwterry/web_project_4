import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import Section from '../components/Section.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage.js';
import Api from '../components/Api.js';
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
  cardCssObj,
  authToken
} from '../utils/constants.js';

import './index.css';

(function main() {
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
    return api.updateCardLikes(cardId, isLiking)
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

  const userInfo = new UserInfo({
    nameOfUserSelector: profileNameSelector,
    descriptionAboutUserSelector: profileSelfDescriptionSelector,
    avatarForUserSelector: profileAvatarSelector,
    avatarOverlaySelector: profileAvatarOverlaySelector
  }, () => popupWithProfileImgChangeForm.open());

  const api = new Api({
    headers: {
      authorization: authToken
    }
  });

  let cardListSection = getCardListSection([], popupWithImage);

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
      const { id: userId } = userInfo.getUserInfo();
      const cards = cardsFromApi.map(({ name, link, likes, _id, owner }) => { 

        const isCardLikedByUser = likes.some((someUser) => someUser._id === userId);
        const isUserTheOwner = owner._id === userId;

        console.log(userId, isCardLikedByUser, likes);

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

        api.updateUserProfile(profileName, aboutMe)
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

        api.createCard(locationTitle, imageLink)
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

        api.deleteCard(cardId)
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

        api.updateUserAvatar(avatarLink)
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
  
})();



