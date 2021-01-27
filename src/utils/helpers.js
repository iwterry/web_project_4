import Card from '../components/Card.js';
import Section from '../components/Section.js';
import { 
  cardCssObj, 
  cardsCollectionSelector, 
  cardTemplateSelector, 
  submitBtnTextWhileProcessing 
} from './constants.js';

/*
  Note: The functions here are exported mainly to help with readablity of 
  both the functions and what is occurring in index.js
*/

export function logErrors(err) {
  console.log(`Error: ${err}`);
}

// not meant to be export at this time
function getNewCardElement(
  cardData,
  { popupWithImage, popupWithConfirmationPromptForm, api }
) {

  const data = {
    cardInfo: cardData,
    css: cardCssObj
  };

  const callbacks = {
    handleCardClick: () => popupWithImage.open(cardData.link, cardData.name),
    getUpdatedNumLikesFromApiAfterUserAction: (cardId, isLiking) => {
      return api.updateCardLikes(cardId, isLiking)
        .then(({ likes }) => {
          return {numLikes: likes.length};
        })
        .catch(logErrors);
    },
    handleDeleteCard: (cardId) => {
      popupWithConfirmationPromptForm.setInputValues({id: cardId});
      popupWithConfirmationPromptForm.open();
    }
  };

  const newCard = new Card(cardTemplateSelector, data, callbacks);
  return newCard.generateNewCardElement();
}

export function getNewCardListSection(
  items,
  { popupWithImage, api, popupWithConfirmationPromptForm }
) {
  const cardListSection = new Section({ 
    items: items,
    renderer: (cardData) => {
      const newCardElement = getNewCardElement(
        cardData,
        { popupWithConfirmationPromptForm, api, popupWithImage }
      );
      cardListSection.addItem(newCardElement);
    }
  }, cardsCollectionSelector);

  return cardListSection;
}

export function displayInitialCards(
  cardsFromApi, 
  { userInfo, popupWithImage, popupWithConfirmationPromptForm, api }
) {
  const { id: userId } = userInfo.getUserInfo();

  const cards = cardsFromApi
    .map(({ name, link, likes, _id, owner }) => {
      const isCardLikedByUser = likes.some((someUser) => someUser._id === userId);
      const isUserTheOwner = owner._id === userId;

      return {
        name,
        link,
        initialNumLikes: likes.length,
        id: _id,
        isLiked: isCardLikedByUser,
        isOwner: isUserTheOwner
      };
    });

  const cardListSection = getNewCardListSection(
    cards, 
    { popupWithImage, api, popupWithConfirmationPromptForm }
  );

  cardListSection.renderItems();
  return cardListSection;
}

export function handleFormSubmitForProfileEditForm(popupWithProfileEditForm, api, userInfo) {
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
    .catch(logErrors)
    .finally(() => {
      popupWithProfileEditForm.setSubmitBtnText(originalText);
      popupWithProfileEditForm.close();
    });
}

export function handleFormSubmitForCardCreationForm({
  popupWithCardCreationForm,
  api, 
  popupWithImage, 
  popupWithConfirmationPromptForm, 
  cardListSection
}) {
  const { locationTitle, imageLink } = popupWithCardCreationForm.getInputValues();
  const orignalText = popupWithCardCreationForm.getSubmitBtnText();

  popupWithCardCreationForm.setSubmitBtnText(submitBtnTextWhileProcessing);

  api.createCard(locationTitle, imageLink)
    .then(({ name, link, _id }) => {
      const newCardElement = getNewCardElement(
        { name, link, id: _id },
        { popupWithImage, popupWithConfirmationPromptForm, api }
      );

      cardListSection.addItem(newCardElement);
    })
    .catch(logErrors)
    .finally(() => {
      popupWithCardCreationForm.setSubmitBtnText(orignalText);
      popupWithCardCreationForm.close();
    });
}

export function handleFormSubmitForConfirmationPromptForm(popupWithConfirmationPromptForm, api) {
  const { id: cardId } = popupWithConfirmationPromptForm.getInputValues();

  api.deleteCard(cardId)
    .then(() => Card.delete(cardId))
    .catch(logErrors)
    .finally(() => popupWithConfirmationPromptForm.close());
}

export function handleFormSubmitForProfileImgChangeForm(popupWithProfileImgChangeForm, api, userInfo) {
  const { avatarLink } = popupWithProfileImgChangeForm.getInputValues();
  const originalText = popupWithProfileImgChangeForm.getSubmitBtnText();

  popupWithProfileImgChangeForm.setSubmitBtnText(submitBtnTextWhileProcessing);

  api.updateUserAvatar(avatarLink)
    .then(({ avatar }) => userInfo.setUserInfo({ avatarLink: avatar }))
    .catch(logErrors)
    .finally(() => {
      popupWithProfileImgChangeForm.setSubmitBtnText(originalText);
      popupWithProfileImgChangeForm.close();
    });
}