// ########### defining DOM variables #########
const closeButtons = document.querySelectorAll('.overlay__close-btn');

const cardPopupImage = document.querySelector('.image-popup__image');
const cardPopupImageTitle = document.querySelector('.image-popup__title');

const profileEditForm = document.querySelector('.web-project-four-form_type_profile-edit');
const profileEditNameInput = profileEditForm
  .querySelector('.web-project-four-form__input_type_profile-name');
const profileEditAboutMeInput = profileEditForm
  .querySelector('.web-project-four-form__input_type_profile-about-me');

const cardCreationForm = document.querySelector('.web-project-four-form_type_location-create');
const cardCreationTitle = cardCreationForm
  .querySelector('.web-project-four-form__input_type_location-title');
const cardCreationImageLink = cardCreationForm
  .querySelector('.web-project-four-form__input_type_location-image-link');

const profileName = document.querySelector('.profile__name');
const profileSelfDescription = document.querySelector('.profile__self-description');
const editButton = document.querySelector('.profile__edit-btn');
const addButton = document.querySelector('.profile__add-btn');

const cardsCollection = document.querySelector('.locations__collection');
const cardTemplate = document.querySelector('#location').content;

const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://code.s3.yandex.net/web-code/yosemite.jpg"
  },
  {
    name: "Lake Louise",
    link: "https://code.s3.yandex.net/web-code/lake-louise.jpg"
  },
  {
    name: "Bald Mountains",
    link: "https://code.s3.yandex.net/web-code/bald-mountains.jpg"
  },
  {
    name: "Latemar",
    link: "https://code.s3.yandex.net/web-code/latemar.jpg"
  },
  {
    name: "Vanoise National Park",
    link: "https://code.s3.yandex.net/web-code/vanoise.jpg"
  },
  {
    name: "Lago di Braies",
    link: "https://code.s3.yandex.net/web-code/lago.jpg"
  }
]; 


// ####### defining event handlers #######
// ------ handlers / helpers dealing with overlay
function getOverlay(childOfOrIsAnOverlay) {
  return childOfOrIsAnOverlay.closest('.overlay');
}

function hidePopup(childOfOrIsAnOverlay) {
  getOverlay(childOfOrIsAnOverlay).classList.remove('overlay_opened');
 }
 
 function showPopup(childOfOrIsAnOverlay) {
   getOverlay(childOfOrIsAnOverlay).classList.add('overlay_opened');
 }

function handleHidePopup(evt) {
  const overlayCloseButton = evt.target;
  hidePopup(overlayCloseButton);
}

// ------ handlers dealing with editing profile
function handleEditProfile() {
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
function handleAddCard() {
  showPopup(cardCreationForm);
}

function handleSaveCard(evt) {
  evt.preventDefault();

  addCard({
    name: cardCreationTitle.value,
    link: cardCreationImageLink.value
  });

  hidePopup(cardCreationForm);
}

function handleDeleteCard(evt) {
  const eventTarget = evt.target;
  eventTarget.closest('.location').remove();
}

function handleLikeCard(evt) {
  const eventTarget = evt.target;
  eventTarget.classList.toggle('location__like-btn_active');
}

function addCard({ name: cardName, link: cardImageLink }) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector('.location__image');

  cardImage.src = cardImageLink;
  cardImage.alt = cardName;
  cardElement.querySelector('.location__name').textContent = cardName;

  cardElement.querySelector('.location__delete-btn').addEventListener('click', handleDeleteCard);
  cardElement.querySelector('.location__like-btn').addEventListener('click', handleLikeCard);
  cardElement.querySelector('.location__image').addEventListener('click', handleSelectImage);

  cardsCollection.prepend(cardElement);
}

// ------ handlers dealing with selecting popup image
function handleSelectImage(evt) {
  const cardImage = evt.target;

  cardPopupImage.src = cardImage.src;
  cardPopupImage.alt = cardImage.alt;
  cardPopupImageTitle.textContent = cardImage.alt;

  showPopup(cardPopupImage);
}

// ######### adding cards and handlers #######
// ------ add initial cards to the DOM
initialCards.forEach(addCard);

//---- adding event handlers
editButton.addEventListener('click', handleEditProfile);
profileEditForm.addEventListener('submit', handleSaveProfile);
addButton.addEventListener('click', handleAddCard);
cardCreationForm.addEventListener('submit', handleSaveCard);
closeButtons.forEach((closeButton) => closeButton.addEventListener('click', handleHidePopup));